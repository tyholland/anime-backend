const mysql = require('../../utils/mysql').instance();
const jwt = require('jsonwebtoken');
const secret = process.env.REACT_APP_SECRET;

module.exports.getAccount = (req, res) => {
  const { firebaseUID } = req.body;

  mysql.query(
    'SELECT * FROM accounts a, users u WHERE u.id = a.user_id AND u.firebase_uid = ?',
    [firebaseUID],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'no account available',
        });
      }

      return res.status(200).json(results);
    }
  );
};

module.exports.loginUser = (req, res) => {
  const { firebaseUID, email } = req.body;

  mysql.query(
    'SELECT u.email, a.user_id, u.active, a.username FROM accounts a, users u WHERE u.id = a.user_id AND u.firebase_uid = ? AND u.email = ?',
    [firebaseUID, email],
    (error, data) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'user does not exist',
        });
      }

      const user = {
        email,
        firebaseUID,
      };
      const accessToken = jwt.sign(user, secret, { expiresIn: '7d' });

      return res.status(200).json({
        ...data[0],
        accessToken,
      });
    }
  );
};

module.exports.createUser = async (req, res) => {
  const { userEmail, firebaseId } = req.body;
  const date = new Date().toISOString();

  mysql.query(
    'SELECT * FROM users WHERE email = ?',
    [userEmail],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'select users',
        });
      }

      if (results[0]?.email === userEmail) {
        return res.status(400).json({
          message: 'User\'s email already exists',
        });
      }

      mysql.query(
        'INSERT INTO `users` (`email`, `firebase_uid`, `create_date`) VALUES (?, ?, ?)',
        [userEmail, firebaseId, date],
        (error, users) => {
          if (error) {
            return res.status(500).json({
              ...error,
              action: 'insert into users',
            });
          }

          mysql.query(
            'INSERT INTO `accounts` (`user_id`) VALUES (?, ?)',
            [users.insertId],
            (error) => {
              if (error) {
                return res.status(500).json({
                  ...error,
                  action: 'insert into accounts',
                });
              }

              mysql.query(
                'SELECT u.email, acct.user_id, u.active, acct.username FROM accounts acct, users u WHERE u.id = acct.user_id ORDER BY u.id = ?',
                [users.insertId],
                (error, data) => {
                  if (error) {
                    return res.status(500).json({
                      ...error,
                      action: 'get account and user data',
                    });
                  }

                  const user = {
                    email: data[0].email,
                    firebaseUID: data[0].firebase_uid,
                  };
                  const accessToken = jwt.sign(user, secret, {
                    expiresIn: '7d',
                  });

                  return res.status(200).json({
                    ...data[0],
                    accessToken,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports.deleteAccount = async (req, res) => {
  const { id } = req.params;

  mysql.query('UPDATE users SET active = ? WHERE id = ?', [1, id], (error) => {
    if (error) {
      return res.status(500).json({
        ...error,
        action: 'delete account',
      });
    }

    return res.status(200).json({
      success: true,
    });
  });
};

module.exports.updateAccount = async (req, res) => {
  const { id } = req.params;

  mysql.query(
    'UPDATE accounts SET username = ? WHERE user_id = ?',
    [1, id],
    (error) => {
      if (error) {
        return res.status(500).json({
          ...error,
          action: 'delete account',
        });
      }

      return res.status(200).json({
        success: true,
      });
    }
  );
};
