const mysql = require('../../utils/mysql').instance();
const {
  addLeagueSegment,
  addMemberToSegment,
  sendLeagueStartEmail,
  sendLeagueDeletedEmail,
} = require('../../utils/mailchimp');
const {
  createNewTeam,
  getLeagueMemebrInfo,
  checkValidUserInLeague,
  createPlayoffsSchedule,
  getRankings,
} = require('../../utils/query');
const Profanity = require('profanity-js');
const profanity = new Profanity('', {
  language: 'en-us',
});

module.exports.getLeague = async (req, res) => {
  const { league_id } = req.params;
  const { userId } = req.user;

  try {
    const leagueData = await mysql(
      'SELECT l.name, l.num_teams, l.creator_id, t.id as teamId FROM league l, league_members lm, team t WHERE l.id = ? AND l.id = lm.league_id AND lm.user_id = ? AND lm.id = t.league_member_id AND l.week = t.week',
      [league_id, userId]
    );

    return res.status(200).json(leagueData);
  } catch (error) {
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
      'SELECT l.name, l.id as leagueId, lm.team_name, t.id as teamId FROM league_members lm, league l, team t WHERE lm.user_id = ? AND lm.league_id = l.id AND lm.id = t.league_member_id AND l.week = t.week',
      [userId]
    );

    return res.status(200).json(leagueData);
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Get All Leagues',
    });
  }
};

module.exports.createLeague = async (req, res) => {
  const { name, numTeams } = req.body;
  const { userId } = req.user;
  const date = new Date().toISOString();
  const randomStr = (Math.random() + 1).toString(36).substring(5);
  const hash = `ABZ-${randomStr}`;

  if (profanity.isProfane(name)) {
    return res.status(400).json({
      message: 'You can not have profanity in your league name',
    });
  }

  try {
    const newLeague = await mysql(
      'INSERT INTO `league` (`name`, `num_teams`, `active`, `creator_id`, `is_roster_active`, `is_voting_active`, `hash`, `create_date`, week) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, numTeams, 1, userId, 1, 0, hash, date, -1]
    );

    await addLeagueSegment(name, newLeague.insertId);

    return await createNewTeam(userId, newLeague.insertId, res);
  } catch (error) {
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

    const { active, num_teams, id, name } = league[0];

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

    await addMemberToSegment(name, id, email);

    return await createNewTeam(userId, id, res);
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Join League',
    });
  }
};

module.exports.updateLeague = async (req, res) => {
  const { name, teams, isActive } = req.body;
  const { league_id } = req.params;

  try {
    await mysql(
      'UPDATE league SET name = ?, num_teams = ?, active = ? WHERE id = ?',
      [name, teams, isActive, league_id]
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
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
      'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b FROM matchup m, league l WHERE m.league_id = ? AND m.week = l.week',
      [league_id]
    );

    const teamA = [];
    const teamB = [];

    games.forEach((item) => {
      teamA.push(item.team_a);
      teamB.push(item.team_b);
    });

    const scoreboardA = await getLeagueMemebrInfo(teamA);
    const scoreboardB = await getLeagueMemebrInfo(teamB);

    const mainScoreboard = [];

    for (let index = 0; index < games.length; index++) {
      mainScoreboard.push({
        teamA: scoreboardA[index].team_name,
        teamB: scoreboardB[index].team_name,
        scoreA: games[index].score_a,
        scoreB: games[index].score_b,
      });
    }

    return res.status(200).json(mainScoreboard);
  } catch (error) {
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
      'SELECT m.team_a, m.team_b, m.score_a, m.score_b FROM league_members lm, team t, matchup m, league l WHERE lm.id = t.league_member_id AND m.team_a = t.id AND l.id = ? AND m.week < l.week',
      [league_id]
    );

    if (!games.length) {
      isFirstWeek = true;

      games = await mysql(
        'SELECT m.id, m.team_a, m.team_b, m.score_a, m.score_b FROM matchup m, league l WHERE m.league_id = ? AND m.week = l.week',
        [league_id]
      );
    }

    const rankings = await getRankings(games, isFirstWeek);

    return res.status(200).json(rankings);
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Get standings',
    });
  }
};

module.exports.startLeague = async (req, res) => {
  const { userId } = req.user;
  const { leagueId } = req.body;

  try {
    await mysql('UPDATE league SET week = ? WHERE creator_id = ? AND id = ?', [
      0,
      userId,
      leagueId,
    ]);

    const league = await mysql('SELECT name FROM league WHERE id = ?', [
      leagueId,
    ]);

    await sendLeagueStartEmail(league[0].name, leagueId);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Start league',
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

    return res.status(200).json({
      league: leagueData[0],
      teams,
    });
  } catch (error) {
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

    const firstRound = await createPlayoffsSchedule(league_id, 10);
    const semis = await createPlayoffsSchedule(league_id, 11);
    const finals = await createPlayoffsSchedule(league_id, 12);

    const playoffSchedule = {
      firstRound,
      semis,
      finals,
    };

    return res.status(200).json(playoffSchedule);
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Get playoff schedule',
    });
  }
};
