const mysql = require('../../utils/mysql').instance();

module.exports.getAccount = (req, res) => {
  const { firebaseUID } = req.body;

  mysql.query('SELECT * FROM accounts as a, users as u WHERE u.id = a.user_id AND u.firebase_uid = ?', [firebaseUID], (error, results) => {
    if (error) {
      return res.status(500).json(error);
    }

    return res.status(200).json(results);
  });
};

module.exports.addUser = async (req, res) => {
  const { email, username } = req.body;
  const date = new Date().toISOString();

  mysql.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'select users'
      });
    }

  if (results[0]?.email === email) {
      return res.status(400).json({
        message: 'User\'s email already exists'
      });
    }

    mysql.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'select accounts'
        });
      }

      if (results[0]?.username === username) {
        return res.status(400).json({
          message: 'Username already exists'
        });
      }

      mysql.query('INSERT INTO `users` (`email`, `firebase_uid`, `create_date`) VALUES (?, ?, ?)', [email, '123', date], (error, users) => {
        if (error) {
          return res.status(500).json({
            ...error,
            action: 'insert into users'
          });
        }

        mysql.query('INSERT INTO `accounts` (`user_id`, `username`) VALUES (?, ?, ?)', [users.insertId, username], (error) => {
          if (error) {
            return res.status(500).json({
              ...error,
              action: 'insert into accounts'
            });
          }

          return res.status(200).json({
            success: true,
          });
        });
      });
    });
  });
};
