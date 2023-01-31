const mysql = require('../../utils/mysql').instance();
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../../utils');
const secret = process.env.REACT_APP_SECRET;

module.exports.loginUser = async (req, res) => {
  const { firebaseUID, email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const account = await mysql(
      'SELECT email, id as user_id, active FROM users WHERE firebase_uid = ? AND email = ?',
      [firebaseUID, email]
    );

    if (!account.length) {
      return res.status(400).json({
        message: 'User does not exists',
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
      ...error,
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
    const user = await mysql('SELECT * FROM users WHERE email = ?', [
      userEmail,
    ]);

    if (user[0]?.email === userEmail) {
      return res.status(400).json({
        message: 'User\'s email already exists',
      });
    }

    const newUser = await mysql(
      'INSERT INTO `users` (`email`, `firebase_uid`, `create_date`) VALUES (?, ?, ?)',
      [userEmail, firebaseId, date]
    );

    const account = await mysql(
      'SELECT email, id as user_id, active FROM users WHERE id = ?',
      [newUser.insertId]
    );

    const accessObj = {
      email: account[0].email,
      userId: account[0].user_id,
      firebaseUID: account[0].firebase_uid,
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
      ...error,
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

    await mysql('UPDATE users SET active = ? WHERE id = ?', [1, userId]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Delete Account',
    });
  }
};

module.exports.logoutUser = (req, res) => {
  return res.clearCookie('token').status(200).json({ success: true });
};
