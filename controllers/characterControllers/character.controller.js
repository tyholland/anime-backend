const mysql = require('../../utils/mysql').instance();

module.exports.getAllCharacters = (req, res) => {
  mysql.query('SELECT * FROM players', (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json(results);
  });
};
