const mysql = require('../../utils/mysql').instance();
const { createNewTeam } = require('../../utils/query');

module.exports.getLeague = async (req, res) => {
  const { league_id } = req.params;
  const { userId } = req.user;

  try {
    const leagueData = await mysql(
      'SELECT l.name, l.num_teams, t.id as teamId FROM league l, league_members lm, team t WHERE lm.league_id = ? AND lm.user_id = ? AND lm.id = t.league_member_id',
      [league_id, userId]
    );

    return res.status(200).json(leagueData);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get League',
    });
  }
};

module.exports.getAllLeagues = async (req, res) => {
  const { userId } = req.user;

  try {
    const leagueData = await mysql(
      'SELECT l.name, l.id as leagueId, lm.team_name, t.id as teamId FROM league_members lm, league l, team t WHERE lm.user_id = ? AND lm.league_id = l.id AND lm.id = t.league_member_id',
      [userId]
    );

    return res.status(200).json(leagueData);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get All Leagues',
    });
  }
};

module.exports.createLeague = async (req, res) => {
  const { name, numTeams } = req.body;
  const { userId } = req.user;
  const date = new Date().toISOString();

  try {
    const newLeague = await mysql(
      'INSERT INTO `league` (`name`, `num_teams`, `active`, `creator_id`, `has_ended`, `create_date`) VALUES (?, ?, ?, ?, ?, ?)',
      [name, numTeams, 1, userId, 0, date]
    );

    return await createNewTeam(userId, newLeague.insertId, res);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Create League',
    });
  }
};

module.exports.joinLeague = async (req, res) => {
  const { userId } = req.user;
  const { league_id } = req.params;

  try {
    const leagueMember = await mysql(
      'SELECT lm.user_id, l.active, l.num_teams FROM league_members lm, league l WHERE lm.user_id = ? AND lm.league_id = ? AND lm.league_id = l.id',
      [userId, league_id]
    );

    if (!leagueMember.length) {
      return res.status(400).json({
        message: 'The league you are trying to join does not exist.',
      });
    }

    const { user_id, active, num_teams } = leagueMember[0];

    if (active === 0) {
      return res.status(400).json({
        message: 'This league is no longer active.',
      });
    }

    if (num_teams === 10) {
      return res.status(400).json({
        message: 'This league has already reached full capacity.',
      });
    }

    if (userId === user_id) {
      return res.status(400).json({
        message: `User already exists in the league id: ${league_id}`,
      });
    }

    return await createNewTeam(userId, league_id, res);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Join League',
    });
  }
};

module.exports.updateLeague = async (req, res) => {
  const { name, teams, isActive, hasEnded } = req.body;
  const { league_id } = req.params;

  try {
    const updatedLeague = await mysql(
      'UPDATE league SET name = ?, num_teams = ?, active = ?, has_ended = ? WHERE id = ?',
      [name, teams, isActive, hasEnded, league_id]
    );

    return res.status(200).json(updatedLeague);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Update League',
    });
  }
};

module.exports.deleteLeague = async (req, res) => {
  const { league_id } = req.params;

  try {
    await mysql('DELETE FROM league WHERE id = ?', [league_id]);

    await mysql('DELETE FROM league_members WHERE league_id = ?', [league_id]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Delete League',
    });
  }
};
