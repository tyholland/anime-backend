const mysql = require('../../utils/mysql').instance();
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../../utils');
const secret = process.env.SECRET;
const { addMemberToList } = require('../../utils/mailchimp');

module.exports.loginUser = async (req, res) => {
  const { firebaseUID, email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE firebase_uid = ? AND email = ?',
      [firebaseUID, email]
    );

    if (!account.length) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const user = {
      email,
      userId: account[0].user_id,
      firebaseUID,
    };
    const accessToken = jwt.sign(user, secret);

    return res
      .cookie('token', accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        ...account[0],
      });
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Login User',
    });
  }
};

module.exports.createUser = async (req, res) => {
  const { userEmail, firebaseId } = req.body;
  const date = new Date().toISOString();

  if (!validateEmail(userEmail)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const user = await mysql(
      'SELECT * FROM users WHERE email = ? AND active = ?',
      [userEmail, 1]
    );

    if (user[0]?.email === userEmail) {
      return res.status(400).json({
        message: 'User\'s email already exists',
      });
    }

    const oldUser = await mysql(
      'SELECT email, id as user_id FROM users WHERE email = ? AND active = ?',
      [userEmail, 0]
    );

    if (oldUser.length) {
      await mysql(
        'UPDATE users SET firebase_uid = ?, active = ? WHERE id = ?',
        [firebaseId, 1, oldUser[0].user_id]
      );

      const accessObj = {
        email: oldUser[0].email,
        userId: oldUser[0].user_id,
        firebaseUID: firebaseId,
      };
      const accessToken = jwt.sign(accessObj, secret);

      return res
        .cookie('token', accessToken, {
          httpOnly: true,
          secure: true,
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .status(200)
        .json({
          ...oldUser[0],
        });
    }

    const newUser = await mysql(
      'INSERT INTO `users` (`email`, `firebase_uid`, `create_date`) VALUES (?, ?, ?)',
      [userEmail, firebaseId, date]
    );

    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE id = ?',
      [newUser.insertId]
    );

    await addMemberToList('809a3f862c', account[0].email);

    const accessObj = {
      email: account[0].email,
      userId: account[0].user_id,
      firebaseUID: firebaseId,
    };
    const accessToken = jwt.sign(accessObj, secret);

    return res
      .cookie('token', accessToken, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        ...account[0],
      });
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Create User',
    });
  }
};

module.exports.deleteAccount = async (req, res) => {
  const { userId } = req.user;

  try {
    const userLeagues = await mysql(
      'SELECT * FROM league_members lm, league l WHERE lm.user_id = ? AND lm.league_id = l.id AND l.active = ?',
      [userId, 1]
    );

    if (userLeagues.length) {
      return res.status(400).json({
        message: 'You can not delete an account that is in an active league',
      });
    }

    await mysql('UPDATE users SET active = ? WHERE id = ?', [0, userId]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error,
      action: 'Delete Account',
    });
  }
};

module.exports.logoutUser = (req, res) => {
  return res.clearCookie('token').status(200).json({ success: true });
};
