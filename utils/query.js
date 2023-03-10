const mysql = require('./mysql').instance();
const { sortRankings } = require('./index');
const { sendLeagueEndedEmail } = require('./mailchimp');
const { getFullTeamMatchupPoints } = require('./team');

module.exports.startNewWeek = async () => {
  try {
    const leagues = await mysql(
      'SELECT id, week, name FROM league WHERE active = ? AND week != ?',
      [1, -1]
    );

    for (let index = 0; index < leagues.length; index++) {
      const { week, id, name } = leagues[index];
      const newWeek = week + 1;

      await mysql(
        'UPDATE matchup SET active = ? WHERE league_id = ? AND week = ?',
        [0, id, week]
      );

      if (week === 12) {
        await mysql(
          'UPDATE league SET active = ?, is_roster_active = ?, is_voting_active = ? WHERE id = ?',
          [0, 0, 0, id]
        );
        await sendLeagueEndedEmail(name, id);
        return;
      }

      await mysql(
        'UPDATE league SET week = ?, is_roster_active = ? WHERE id = ?',
        [newWeek, 1, id]
      );

      await mysql(
        'UPDATE matchup SET active = ? WHERE league_id = ? AND week = ?',
        [1, id, newWeek]
      );
    }
  } catch (err) {
    throw new Error('Can not start new week');
  }
};

module.exports.stopRosterStartVoting = async () => {
  try {
    const leagues = await mysql(
      'SELECT id FROM league WHERE active = ? AND (week != ? OR week != ?)',
      [1, 0, -1]
    );

    for (let index = 0; index < leagues.length; index++) {
      const { id } = leagues[index];

      await mysql(
        'UPDATE league SET is_roster_active = ?, is_voting_active = ? WHERE id = ?',
        [0, 1, id]
      );
    }
  } catch (err) {
    throw new Error('Can not stop roster change and start voting');
  }
};

module.exports.stopUserVoting = async () => {
  try {
    const leagues = await mysql(
      'SELECT id, week FROM league WHERE active = ? AND (week != ? OR week != ?)',
      [1, 0, -1]
    );

    for (let index = 0; index < leagues.length; index++) {
      const { id, week } = leagues[index];

      await mysql('UPDATE league SET is_voting_active = ? WHERE id = ?', [
        0,
        id,
      ]);

      const matchup = await mysql(
        'SELECT * FROM matchup WHERE league_id = ? AND week = ?',
        [id, week]
      );

      for (let index = 0; index < matchup.length; index++) {
        await mysql(
          'UPDATE votes SET active = ? WHERE matchup_id = ? AND is_bracket = ?',
          [0, matchup[index].id, 0]
        );
      }
    }
  } catch (err) {
    throw new Error('Can not stop voting');
  }
};

module.exports.getLeagueMemebrInfo = async (arrayOfIds) => {
  return await mysql(
    'SELECT lm.team_name, lm.id FROM league_members lm, team t WHERE t.id IN (?) AND lm.id = t.league_member_id',
    [arrayOfIds]
  );
};

module.exports.checkMatchupUserExists = async (userId, matchupId, res) => {
  const user = await mysql(
    'SELECT * from league_members lm, matchup m WHERE m.id = ? AND m.league_id = lm.league_id AND lm.user_id = ?',
    [matchupId, userId]
  );

  if (!user.length) {
    return res.status(400).json({
      message: 'You are not a user in the league for this matchup.',
    });
  }
};

module.exports.checkValidUserInLeague = async (userId, leagueId, res) => {
  const validUser = await mysql(
    'SELECT * FROM league_members WHERE league_id = ? AND user_id = ?',
    [leagueId, userId]
  );

  if (!validUser.length) {
    return res.status(400).json({
      message: 'You are not a user in this league and can not view this page.',
    });
  }
};

module.exports.getRankings = async (games, isFirstWeek = false) => {
  try {
    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const rankingsA = await this.getLeagueMemebrInfo(teamA);
    const rankingsB = await this.getLeagueMemebrInfo(teamB);

    const mainRankings = [];

    if (isFirstWeek) {
      for (let index = 0; index < games.length; index++) {
        mainRankings.find((rank) => {
          if (rank.team === rankingsA[index].team_name) {
            return;
          }
        });

        mainRankings.push({
          team: rankingsA[index].team_name,
          teamId: rankingsA[index].id,
          win: 0,
          loss: 0,
        });

        mainRankings.find((rank) => {
          if (rank.team === rankingsB[index].team_name) {
            return;
          }
        });

        mainRankings.push({
          team: rankingsB[index].team_name,
          teamId: rankingsB[index].id,
          win: 0,
          loss: 0,
        });
      }

      return sortRankings(mainRankings);
    }

    for (let index = 0; index < games.length; index++) {
      mainRankings.find((rank) => {
        if (rank.team === rankingsA[index].team_name) {
          rank.win =
            games[index].score_a > games[index].score_b
              ? rank.win + 1
              : rank.win;
          rank.loss =
            games[index].score_a < games[index].score_b
              ? rank.loss + 1
              : rank.loss;
        }
      });

      mainRankings.push({
        team: rankingsA[index].team_name,
        teamId: rankingsA[index].id,
        win: games[index].score_a > games[index].score_b ? 1 : 0,
        loss: games[index].score_a < games[index].score_b ? 1 : 0,
      });

      mainRankings.find((rank) => {
        if (rank.team === rankingsB[index].team_name) {
          rank.win =
            games[index].score_a > games[index].score_b
              ? rank.win + 1
              : rank.win;
          rank.loss =
            games[index].score_a < games[index].score_b
              ? rank.loss + 1
              : rank.loss;
        }
      });

      mainRankings.push({
        team: rankingsB[index].team_name,
        teamId: rankingsB[index].id,
        win: games[index].score_a > games[index].score_b ? 1 : 0,
        loss: games[index].score_a < games[index].score_b ? 1 : 0,
      });
    }

    return sortRankings(mainRankings);
  } catch (err) {
    throw new Error('Can not get rankings');
  }
};

module.exports.activateWeeklyAffinity = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, t.week, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND (week != ? OR week != ?) AND l.id = lm.league_id AND lm.id = t.league_member_id AND l.week = t.week',
      [1, 0, -1]
    );

    if (!teams.length) {
      return;
    }

    for (let index = 0; index < teams.length; index++) {
      const { id, league_id, week } = teams[index];

      // Update activeAffinity to be true
      await mysql('UPDATE team SET activeAffinity = ? WHERE id = ?', [1, id]);

      // Update matchup scores
      const matchup = await mysql(
        'SELECT * FROM matchup WHERE league_id = ? AND week = ?',
        [league_id, week]
      );

      for (let index = 0; index < matchup.length; index++) {
        const { id, team_a, team_b } = matchup[index];

        const scoreA = await getFullTeamMatchupPoints(team_a, 'team_b', id);
        const scoreB = await getFullTeamMatchupPoints(team_b, 'team_a', id);

        await mysql(
          'UPDATE matchup SET score_a = ?, score_b = ? WHERE id = ?',
          [scoreA, scoreB, id]
        );
      }
    }
  } catch (err) {
    throw new Error('Can not activate weekly affinity');
  }
};
