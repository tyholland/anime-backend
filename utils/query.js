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

      // Make previous week inactive
      await mysql(
        'UPDATE matchup SET active = ? WHERE league_id = ? AND week = ?',
        [0, id, week]
      );

      if (week === 0) {
        const teams = await mysql(
          'SELECT t.id FROM league_members lm, team t WHERE lm.league_id = ? AND lm.id = t.league_member_id',
          [id]
        );

        for (let i = 0; i < teams.length; i++) {
          await mysql('UPDATE team SET week = ? WHERE id = ?', [
            newWeek,
            teams[i].id,
          ]);
        }
      }

      if (week === 12) {
        await mysql(
          'UPDATE league SET active = ?, is_roster_active = ?, is_voting_active = ? WHERE id = ?',
          [0, 0, 0, id]
        );
        await sendLeagueEndedEmail(name, id);
        return;
      }

      // Make new week available to change roster
      await mysql(
        'UPDATE league SET week = ?, is_roster_active = ? WHERE id = ?',
        [newWeek, 1, id]
      );

      // Make the new week matchup active
      await mysql(
        'UPDATE matchup SET active = ? WHERE league_id = ? AND week = ?',
        [1, id, newWeek]
      );

      // Show recap modal
      if (newWeek > 1) {
        await mysql('UPDATE league_members SET recap = ? WHERE league_id = ?', [
          1,
          id,
        ]);
      }

      // Update new week with latest team roster
      const leagueMembers = await mysql(
        'SELECT * FROM league_members WHERE league_id = ?',
        [id]
      );

      for (let res = 0; res < leagueMembers.length; res++) {
        const memberId = leagueMembers[res].id;

        const roster = await mysql(
          'SELECT * FROM team WHERE week = ? AND league_member_id = ?',
          [week, memberId]
        );

        if (!roster.length) {
          return;
        }

        await mysql(
          'UPDATE team SET captain = ?, brawler_a = ?, brawler_b = ?, bs_brawler = ?, bs_support = ?, support = ?, villain = ?, battlefield = ?, points = ? WHERE league_member_id = ? AND week = ?',
          [roster[0].captain, roster[0].brawler_a, roster[0].brawler_b, roster[0].bs_brawler, roster[0].bs_support, roster[0].support, roster[0].villain, roster[0].battlefield, roster[0].points, memberId, newWeek]
        );
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error('Can not start new week');
  }
};

module.exports.stopRosterStartVoting = async () => {
  try {
    const leagues = await mysql(
      'SELECT id FROM league WHERE active = ? AND week > ?',
      [1, 0]
    );

    for (let index = 0; index < leagues.length; index++) {
      const { id } = leagues[index];

      await mysql(
        'UPDATE league SET is_roster_active = ?, is_voting_active = ? WHERE id = ?',
        [0, 1, id]
      );
    }
  } catch (err) {
    console.log(err);
    throw new Error('Can not stop roster change and start voting');
  }
};

module.exports.stopUserVoting = async () => {
  try {
    const leagues = await mysql(
      'SELECT id, week FROM league WHERE active = ? AND week > ?',
      [1, 0]
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
    console.log(err);
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

    // Remove any team id's that are 0 from TeamB
    const removeItems = [];

    for (let index = 0; index < teamB.length; index++) {
      if (teamB[index] === 0) {
        removeItems.push(index);
      }
    }

    removeItems.forEach((item, index) => {
      const val = index > 0 ? item -1 : item;
      teamB.splice(val, 1);
    });

    // Continue with getting rankings
    const rankingsA = await this.getLeagueMemebrInfo(teamA);
    const rankingsB = await this.getLeagueMemebrInfo(teamB);

    const mainRankings = [];

    if (isFirstWeek) {
      for (let index = 0; index < games.length; index++) {
        const hasRankingA = mainRankings.some(
          (rank) => rank.team === rankingsA[index].team_name
        );
        const hasRankingB = mainRankings.some(
          (rank) => rank.team === rankingsB[index].team_name
        );

        if (!hasRankingA) {
          mainRankings.push({
            team: rankingsA[index].team_name,
            teamId: rankingsA[index].id,
            win: 0,
            loss: 0,
          });
        }

        if (!hasRankingB) {
          mainRankings.push({
            team: rankingsB[index].team_name,
            teamId: rankingsB[index].id,
            win: 0,
            loss: 0,
          });
        }
      }

      return sortRankings(mainRankings);
    }

    for (let index = 0; index < games.length; index++) {
      if (games[index].week === 10 && games[index].team_b === 0) {
        const byeTeam = [
          {
            team_name: `Bye Team Name - ${index}`,
            id: `Bye Team Id - ${index}`
          },
        ];
  
        rankingsB.push(byeTeam);
      }

      const hasRankingA = mainRankings.some(
        (rank) => rank.team === rankingsA[index].team_name
      );
      const hasRankingB = mainRankings.some(
        (rank) => rank.team === rankingsB[index].team_name
      );

      if (hasRankingA) {
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
      }

      if (!hasRankingA) {
        mainRankings.push({
          team: rankingsA[index].team_name,
          teamId: rankingsA[index].id,
          win: games[index].score_a > games[index].score_b ? 1 : 0,
          loss: games[index].score_a < games[index].score_b ? 1 : 0,
        });
      }

      if (hasRankingB) {
        mainRankings.find((rank) => {
          if (rank.team === rankingsB[index].team_name) {
            rank.win =
              games[index].score_b > games[index].score_a
                ? rank.win + 1
                : rank.win;
            rank.loss =
              games[index].score_b < games[index].score_a
                ? rank.loss + 1
                : rank.loss;
          }
        });
      }

      if (!hasRankingB) {
        mainRankings.push({
          team: games[index].team_b === 0 ? 'Bye' : rankingsB[index].team_name,
          teamId: rankingsB[index].id,
          win: games[index].score_b > games[index].score_a ? 1 : 0,
          loss: games[index].score_b < games[index].score_a ? 1 : 0,
        });
      }
    }

    return sortRankings(mainRankings);
  } catch (err) {
    console.log(err);
    throw new Error('Can not get rankings');
  }
};

module.exports.activateWeeklyAffinity = async () => {
  try {
    const teams = await mysql(
      'SELECT t.id, t.week, l.id as league_id FROM league l, league_members lm, team t WHERE l.active = ? AND (l.week != ? OR l.week != ?) AND l.id = lm.league_id AND lm.id = t.league_member_id AND l.week = t.week',
      [1, 0, -1]
    );

    if (!teams.length) {
      return;
    }

    for (let index = 0; index < teams.length; index++) {
      const { id } = teams[index];

      // Update activeAffinity to be true
      await mysql('UPDATE team SET activeAffinity = ? WHERE id = ?', [1, id]);
    }

    // Update matchup scores
    const matchup = await mysql(
      'SELECT * FROM matchup WHERE league_id = ? AND week = ?',
      [teams[0].league_id, teams[0].week]
    );

    for (let index = 0; index < matchup.length; index++) {
      const { id, team_a, team_b } = matchup[index];

      if (team_b !== 0) {
        const scoreA = await getFullTeamMatchupPoints(team_a, 'team_b', id);
        const scoreB = await getFullTeamMatchupPoints(team_b, 'team_a', id);

        await mysql(
          'UPDATE matchup SET score_a = ?, score_b = ? WHERE id = ?',
          [scoreA, scoreB, id]
        );
      }
    }
  } catch (err) {
    console.log(err);
    throw new Error('Can not activate weekly affinity');
  }
};
