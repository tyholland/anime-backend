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

module.exports.addLeague = (res, res) => {
  const {name, user_id} = res.body;
  const date = new Date().toISOString();

  mysql.query('INSERT INTO `league` (`name`, `num_teams`, `active`, `user_id`, `has_ended`, `create_date`) VALUES (?, ?, ?, ?, ?, ?)', [name, 1, 1, user_id, 0, date], (error, results) => {
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
  knex('leads')
    .where({ lead_id: req.params.id })
    .del()
    .then((lead) => res.status(200).json(lead))
    .catch((err) => res.status(500).json(err));
};
