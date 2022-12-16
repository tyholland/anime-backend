const knex = require('../../utils/knex').instance();
const mysql = require('../../utils/mysql').instance();

module.exports.getLeague = (req, res) => {
  const { id } = req.params;

  mysql.query('SELECT * FROM league WHERE id = ?', [id], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'get league'
      });
    }

    return res.status(200).json(results);
  });
};

module.exports.getAllLeagues = (req, res) => {
  const { userId } = req.params;

  mysql.query('SELECT * FROM league_members WHERE user_id = ?', [userId], (error, leagues) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'get league members'
      });
    }

    const leagueIds = [];

    leagues.forEach(item => {
      const { id } = item;

      leagueIds.push(id);
    });

    mysql.query('SELECT * FROM league WHERE id IN (?)', [leagueIds], (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get league'
        });
      }

      return res.status(200).json(results);
    });
  });
};

module.exports.createLeague = (req, res) => {
  const {name, user_id} = req.body;
  const date = new Date().toISOString();

  mysql.query('INSERT INTO `league` (`name`, `num_teams`, `active`, `creator_id`, `has_ended`, `create_date`) VALUES (?, ?, ?, ?, ?, ?)', [name, 1, 1, user_id, 0, date], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'add league'
      });
    }

    return res.status(200).json({
      success: true,
    });
  });
};

module.exports.joinLeague = (req, res) => {
  const {user_id} = req.body;
  const {id} = req.param;

  mysql.query('SELECT * FROM league_members WHERE user_id = ?', [userId], (error, leagues) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'get league members'
      });
    }

    if (leagues.user_id === user_id && leagues.league_id === id) {
      return res.status(500).json({
        ...error,
        action: `user already exists in the league id ${id}`
      });
    }
    
    mysql.query('INSERT INTO `league_members` (`user_id`, `league_id`) VALUES (?, ?)', [user_id, id], (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'join league'
        });
      }

      return res.status(200).json({
        success: true,
      });
    });
  });
};

module.exports.updateLeague = (req, res) => {
  const { name, teams, isActive, hasEnded, teamId, userId } = req.body;

  mysql.query('UPDATE league SET name = ?, num_teams = ?, active = ?, has_ended = ? WHERE id = ? and user_id = ?', [name, teams, isActive, hasEnded, teamId, userId], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'update league'
      });
    }

    return res.status(200).json({
      success: true,
    });
  });
};

module.exports.deleteLeague = (req, res) => {
  const { id } = req.params;

  mysql.query('DELETE FROM league WHERE id = ?', [id], (error, league) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'delete league'
      });
    }

    mysql.query('DELETE FROM league_members WHERE league_id = ?', [id], (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'delete league members'
        });
      }

      return res.status(200).json({
        success: true,
      });
    });
  });
};
