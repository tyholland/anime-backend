const mysql = require('../../utils/mysql').instance();

module.exports.getMatchup = (req, res) => {
  const { matchup_id } = req.params;

  mysql.query(
    'SELECT * FROM matchup WHERE id = ?',
    [matchup_id],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'get week matchup',
        });
      }

      return res.status(200).json(results);
    }
  );
};
