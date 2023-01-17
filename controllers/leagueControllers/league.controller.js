const mysql = require('../../utils/mysql').instance();
const { createNewTeam } = require('../../utils/query');

module.exports.getLeague = async (req, res) => {
  const { id } = req.params;
  const { email } = req.user;

  try {
    const user = await mysql('SELECT id FROM users WHERE email = ?', [email]);

    const leagueData = await mysql(
      'SELECT l.name, l.num_teams, t.id as teamId FROM league l, league_members lm, team t WHERE lm.league_id = ? AND lm.user_id = ? AND lm.id = t.league_member_id',
      [id, user[0].id]
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
  const { email } = req.user;

  try {
    const user = await mysql('SELECT id FROM users WHERE email = ?', [email]);
    const leagueData = await mysql(
      'SELECT l.name, l.id as leagueId, lm.team_name, t.id as teamId FROM league_members lm, league l, team t WHERE lm.user_id = ? AND lm.league_id = l.id AND lm.id = t.league_member_id',
      [user[0].id]
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
  const { name, userId, numTeams } = req.body;
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
  const { user_id } = req.body;
  const { id } = req.params;

  try {
    const leagueMember = await mysql(
      'SELECT * FROM league_members WHERE user_id = ?',
      [user_id]
    );

    if (
      !!leagueMember.length &&
      leagueMember[0].user_id === user_id &&
      leagueMember[0].league_id === id
    ) {
      return res.status(400).json({
        message: `User already exists in the league id: ${id}`,
      });
    }

    return await createNewTeam(user_id, id, res);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Join League',
    });
  }
};

module.exports.updateLeague = async (req, res) => {
  const { name, teams, isActive, hasEnded, teamId, userId } = req.body;

  try {
    const updatedLeague = await mysql(
      'UPDATE league SET name = ?, num_teams = ?, active = ?, has_ended = ? WHERE id = ? and user_id = ?',
      [name, teams, isActive, hasEnded, teamId, userId]
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
  const { id } = req.params;

  try {
    await mysql('DELETE FROM league WHERE id = ?', [id]);

    await mysql('DELETE FROM league_members WHERE league_id = ?', [id]);

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
