const mysql = require('../../utils/mysql').instance();
const { createNewTeam } = require('../../utils/index');

module.exports.getLeague = (req, res) => {
  const { id } = req.params;

  mysql.query(
    'SELECT l.name, l.num_teams, t.id as teamId FROM league l, league_members lm, team t WHERE l.id = ? AND l.id = lm.league_id AND lm.id = t.league_member_id',
    [id],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get league',
        });
      }

      return res.status(200).json(results);
    }
  );
};

module.exports.getAllLeagues = (req, res) => {
  const { userId } = req.params;

  mysql.query(
    'SELECT l.name, lm.team_name, t.id as teamId, l.id as leagueId FROM league_members lm, league l, team t WHERE user_id = ? AND lm.league_id = l.id AND t.league_member_id = lm.id',
    [userId],
    (error, data) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get league members, league, and team info',
        });
      }

      return res.status(200).json(data);
    }
  );
};

module.exports.createLeague = (req, res) => {
  const { name, userId, numTeams } = req.body;
  const date = new Date().toISOString();

  mysql.query(
    'INSERT INTO `league` (`name`, `num_teams`, `active`, `creator_id`, `has_ended`, `create_date`) VALUES (?, ?, ?, ?, ?, ?)',
    [name, numTeams, 1, userId, 0, date],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'add league',
        });
      }

      return createNewTeam(userId, results.insertId, res);
    }
  );
};

module.exports.joinLeague = (req, res) => {
  const { user_id } = req.body;
  const { id } = req.param;

  mysql.query(
    'SELECT * FROM league_members WHERE user_id = ?',
    [user_id],
    (error, leagues) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get league members',
        });
      }

      if (leagues.user_id === user_id && leagues.league_id === id) {
        return res.status(500).json({
          ...error,
          action: `user already exists in the league id ${id}`,
        });
      }

      createNewTeam(user_id, id, res);
    }
  );
};

module.exports.updateLeague = (req, res) => {
  const { name, teams, isActive, hasEnded, teamId, userId } = req.body;

  mysql.query(
    'UPDATE league SET name = ?, num_teams = ?, active = ?, has_ended = ? WHERE id = ? and user_id = ?',
    [name, teams, isActive, hasEnded, teamId, userId],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'update league',
        });
      }

      return res.status(200).json(results);
    }
  );
};

module.exports.deleteLeague = (req, res) => {
  const { id } = req.params;

  mysql.query('DELETE FROM league WHERE id = ?', [id], (error) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'delete league',
      });
    }

    mysql.query(
      'DELETE FROM league_members WHERE league_id = ?',
      [id],
      (error) => {
        if (error) {
          return res.status(500).json({
            ...error,
            action: 'delete league members',
          });
        }

        return res.status(200).json({
          success: true,
        });
      }
    );
  });
};
