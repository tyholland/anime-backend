const mysql = require('../../utils/mysql').instance();
const {
  addLeagueSegment,
  sendLeagueDeletedEmail,
  addMemberToSegmentWithId,
} = require('../../utils/mailchimp');
const {
  getLeagueMemberInfo,
  checkValidUserInLeague,
  getRankings,
  checkMatchupUserExists,
} = require('../../utils/query');
const { createPlayoffsSchedule } = require('../../utils/schedule');
const { createNewTeam } = require('../../utils/team');
const Profanity = require('profanity-js');
const profanity = new Profanity('', {
  language: 'en-us',
});

module.exports.getLeague = async (req, res) => {
  const { league_id } = req.params;
  const { userId } = req.user;

  try {
    const leagueData = await mysql(
      'SELECT l.name, l.num_teams, l.week, l.creator_id, l.draft_active, l.draft_complete, l.active, l.draft_schedule FROM league l, league_members lm WHERE l.id = ? AND l.id = lm.league_id AND lm.user_id = ?',
      [league_id, userId]
    );

    const teamData = await mysql(
      'SELECT t.id as teamId FROM league_members lm, league l, team t WHERE lm.user_id = ? AND lm.league_id = ? AND lm.id = t.league_member_id AND l.week = t.week',
      [userId, league_id]
    );

    const matchupData = await mysql(
      'SELECT m.id as matchupId, m.team_b FROM team t, matchup m WHERE t.id = ? AND t.week = m.week AND (t.id = m.team_a OR t.id = m.team_b)',
      [teamData[0]?.teamId]
    );

    const draftRounds = await mysql('SELECT * FROM draft WHERE league_id = ?', [
      league_id,
    ]);

    if (matchupData.length) {
      await checkMatchupUserExists(userId, matchupData[0].matchupId, res);
    }

    return res.status(200).json({
      leagueData,
      matchupData,
      hasDraft: draftRounds.length > 0,
      teamData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get League',
    });
  }
};

module.exports.getAllLeagues = async (req, res) => {
  const { userId } = req.user;

  try {
    const leagueData = await mysql(
      'SELECT l.name, l.week, l.id as leagueId, l.active, lm.team_name, l.draft_complete FROM league_members lm, league l WHERE lm.user_id = ? AND lm.league_id = l.id',
      [userId]
    );

    for (let index = 0; index < leagueData.length; index++) {
      const { leagueId, draft_complete } = leagueData[index];

      const teamData = await mysql(
        'SELECT t.id as teamId FROM league_members lm, league l, team t WHERE lm.user_id = ? AND lm.league_id = ? AND lm.id = t.league_member_id AND l.week = t.week',
        [userId, leagueData[index].leagueId]
      );

      const matchupData = await mysql(
        'SELECT m.id as matchupId FROM team t, matchup m WHERE t.id = ? AND t.week = m.week AND (t.id = m.team_a OR t.id = m.team_b)',
        [teamData[0]?.teamId]
      );

      if (matchupData.length) {
        await checkMatchupUserExists(userId, matchupData[0].matchupId, res);
      }

      const draftRounds = await mysql(
        'SELECT * FROM draft WHERE league_id = ?',
        [leagueId]
      );

      leagueData[index].matchupId = matchupData[0]?.matchupId;
      leagueData[index].teamId = teamData[0]?.teamId;
      leagueData[index].hasDraft =
        draft_complete === 0 && draftRounds.length > 0;
    }

    const pastLeague = leagueData.filter((league) => league.active === 0);
    const activeLeague = leagueData.filter((league) => league.active === 1);

    return res.status(200).json({
      current: activeLeague,
      past: pastLeague,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get All Leagues',
    });
  }
};

module.exports.createLeague = async (req, res) => {
  const { name, numTeams, numBench } = req.body;
  const { userId, email } = req.user;
  const date = new Date().toISOString();
  const randomStr = (Math.random() + 1).toString(36).substring(5);
  const hash = `ABZ-${randomStr}`;

  try {
    const newLeague = await mysql(
      'INSERT INTO `league` (`name`, `num_teams`, `active`, `creator_id`, `is_roster_active`, `is_voting_active`, `hash`, `create_date`, week, `num_bench`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, numTeams, 1, userId, 0, 0, hash, date, -1, numBench]
    );

    const newSegment = await addLeagueSegment(name, newLeague.insertId);

    await addMemberToSegmentWithId(newSegment.id, email);

    await mysql(
      'UPDATE league SET segment = ? WHERE id = ?',
      [newSegment.id, newLeague.insertId]
    );

    return await createNewTeam(userId, newLeague.insertId, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Create League',
    });
  }
};

module.exports.joinLeague = async (req, res) => {
  const { userId, email } = req.user;
  const { hash } = req.body;

  try {
    const league = await mysql('SELECT * FROM league WHERE hash = ?', [hash]);

    if (!league.length) {
      return res.status(400).json({
        message: 'The league you are trying to join does not exist.',
      });
    }

    const { active, num_teams, id, segment } = league[0];

    if (active === 0) {
      return res.status(400).json({
        message: 'This league is no longer active.',
      });
    }

    const leagueMembers = await mysql(
      'SELECT * FROM league_members WHERE league_id = ?',
      [id]
    );

    if (leagueMembers.length === num_teams) {
      return res.status(400).json({
        message: 'This league has already reached full capacity.',
      });
    }

    const userExists = leagueMembers.filter((item) => item.user_id === userId);

    if (userExists.length) {
      return res.status(400).json({
        message: `User already exists in the league id: ${id}`,
      });
    }

    await addMemberToSegmentWithId(segment, email);

    return await createNewTeam(userId, id, res);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Join League',
    });
  }
};

module.exports.updateLeague = async (req, res) => {
  const { name, teams, bench, draft, isActive } = req.body;
  const { league_id } = req.params;

  if (profanity.isProfane(name)) {
    return res.status(400).json({
      message: 'You can not have profanity in your league name',
    });
  }

  try {
    if (bench) {
      await mysql(
        'UPDATE league SET name = ?, num_bench = ?, active = ? WHERE id = ?',
        [name, bench, isActive, league_id]
      );
    }

    if (teams) {
      await mysql(
        'UPDATE league SET name = ?, num_teams = ?, active = ? WHERE id = ?',
        [name, teams, isActive, league_id]
      );
    }

    if (draft) {
      await mysql(
        'UPDATE league SET name = ?, draft_schedule = ?, active = ? WHERE id = ?',
        [name, draft, isActive, league_id]
      );
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Update League',
    });
  }
};

module.exports.deleteLeague = async (req, res) => {
  const { league_id } = req.params;

  try {
    const league = await mysql(
      'SELECT * FROM league WHERE id = ? AND week = ?',
      [league_id, -1]
    );

    if (!league.length) {
      return res.status(400).json({
        message: 'This league is active and can not be deleted',
      });
    }

    await sendLeagueDeletedEmail(league[0].name, league_id);

    await mysql('DELETE FROM league WHERE id = ? AND week = ?', [
      league_id,
      -1,
    ]);

    const members = await mysql(
      'SELECT id FROM league_members WHERE league_id = ?',
      [league_id]
    );

    for (let index = 0; index < members.length; index++) {
      await mysql('DELETE FROM team WHERE league_member_id = ?', [
        members[index].id,
      ]);
    }

    await mysql('DELETE FROM league_members WHERE league_id = ?', [league_id]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Delete League',
    });
  }
};

module.exports.getScoreboard = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;

  try {
    await checkValidUserInLeague(userId, league_id, res);

    const games = await mysql(
      'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b, m.week FROM matchup m, league l WHERE l.id = ? AND l.id = m.league_id AND l.week = m.week',
      [league_id]
    );

    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const scoreboardA = await getLeagueMemberInfo(teamA);
    let scoreboardB = await getLeagueMemberInfo(teamB);

    const mainScoreboard = [];

    for (let index = 0; index < games.length; index++) {
      if (games[index].week === 10 && games[index].team_b === 0) {
        const byeTeam = [
          {
            team_name: `Bye Team Name - ${index}`,
            id: `Bye Team Id - ${index}`,
          },
        ];

        scoreboardB = byeTeam.concat(scoreboardB);
      }

      mainScoreboard.push({
        teamA: scoreboardA[index].team_name,
        teamB: games[index].team_b === 0 ? 'Bye' : scoreboardB[index].team_name,
        scoreA: games[index].score_a < 0 ? 0 : games[index].score_a,
        scoreB: games[index].score_b < 0 ? 0 : games[index].score_b,
        match: games[index].id,
      });
    }

    return res.status(200).json(mainScoreboard);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get scoreboard',
    });
  }
};

module.exports.getStandings = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;
  let isFirstWeek = false;

  try {
    await checkValidUserInLeague(userId, league_id, res);

    let games = await mysql(
      'SELECT m.team_a, m.team_b, m.score_a, m.score_b, m.week FROM league_members lm, team t, matchup m, league l WHERE lm.id = t.league_member_id AND m.team_a = t.id AND l.id = ? AND l.id = m.league_id AND m.week < ?',
      [league_id, 10]
    );

    if (!games.length) {
      isFirstWeek = true;

      games = await mysql(
        'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b, m.week FROM matchup m, league l WHERE m.league_id = ? AND m.week = l.week',
        [league_id]
      );
    }

    let rankings = await getRankings(games, isFirstWeek);

    rankings = rankings.filter((item) => item.team !== undefined);

    return res.status(200).json(rankings);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get standings',
    });
  }
};

module.exports.getLeagueAdminData = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;

  try {
    const leagueData = await mysql(
      'SELECT * FROM league WHERE creator_id = ? AND id = ?',
      [userId, league_id]
    );

    const teams = await mysql(
      'SELECT * FROM league_members WHERE league_id = ?',
      [league_id]
    );

    const draftRounds = await mysql('SELECT * FROM draft WHERE league_id = ?', [
      league_id,
    ]);

    return res.status(200).json({
      league: leagueData[0],
      teams,
      hasDraft: leagueData[0].draft_complete === 1 || draftRounds.length > 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get League Admin',
    });
  }
};

module.exports.removeTeamFromLeague = async (req, res) => {
  const { userId } = req.user;
  const { leagueId } = req.body;
  const { member_id } = req.params;

  try {
    const leagueData = await mysql(
      'SELECT * FROM league WHERE creator_id = ? AND id = ?',
      [userId, leagueId]
    );

    if (!leagueData.length) {
      return res.status(400).json({
        message: 'Only the creator of this league can remove a team',
      });
    }

    if (leagueData[0].week >= 0) {
      return res.status(400).json({
        message: 'You can\'t remove this team beacuse the league is in session',
      });
    }

    await mysql('DELETE FROM league_members WHERE id = ?', [member_id]);

    await mysql('DELETE FROM team WHERE league_member_id = ?', [member_id]);

    const teams = await mysql(
      'SELECT * FROM league_members WHERE league_id = ?',
      [leagueData[0].id]
    );

    return res.status(200).json({
      teams,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Remove Team from League',
    });
  }
};

module.exports.getPlayoffsSchedule = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;

  try {
    await checkValidUserInLeague(userId, league_id, res);

    const firstRound = await createPlayoffsSchedule(league_id, 10, 'first');
    const semis = await createPlayoffsSchedule(league_id, 11, 'semis');
    const finals = await createPlayoffsSchedule(league_id, 12, 'finals');

    const playoffSchedule = {
      firstRound,
      semis,
      finals,
    };

    return res.status(200).json(playoffSchedule);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get playoff schedule',
    });
  }
};

module.exports.getLeagueChamp = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;

  try {
    await checkValidUserInLeague(userId, league_id, res);

    const finalsMatchup = await mysql(
      'SELECT * FROM matchup WHERE league_id = ? AND week = ? AND active = ?',
      [league_id, 12, 0]
    );

    if (!finalsMatchup.length) {
      return res.status(400).json({
        message: 'This league has not reached the Finals yet',
      });
    }

    const isTeamA = finalsMatchup[0].score_a > finalsMatchup[0].score_b;
    const champ = isTeamA ? finalsMatchup[0].team_a : finalsMatchup[0].team_b;

    const champTeam = await mysql(
      'SELECT lm.team_name FROM team t, league_members lm WHERE t.id = ? AND t.league_member_id = lm.id',
      [champ]
    );

    return res.status(200).json({
      champ: champTeam[0].team_name,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Get league champ',
    });
  }
};
