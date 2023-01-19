const mysql = require('../../utils/mysql').instance();
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../../utils');
const secret = process.env.REACT_APP_SECRET;

module.exports.getAccount = async (req, res) => {
  const { userId } = req.user;

  try {
    const account = await mysql(
      'SELECT a.username, u.email FROM accounts a, users u WHERE u.id = ? AND u.id = a.user_id',
      [userId]
    );

    return res.status(200).json(account);
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Get Account',
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const { firebaseUID, email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const account = await mysql(
      'SELECT u.email, a.user_id, u.active, a.username FROM accounts a, users u WHERE u.id = a.user_id AND u.firebase_uid = ? AND u.email = ?',
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

    await mysql('INSERT INTO `accounts` (`user_id`) VALUES (?)', [
      newUser.insertId,
    ]);

    const account = await mysql(
      'SELECT u.email, acct.user_id, u.active, acct.username FROM accounts acct, users u WHERE u.id = acct.user_id ORDER BY u.id = ?',
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

module.exports.updateAccount = async (req, res) => {
  const { userId } = req.user;
  const { userName } = req.body;

  try {
    await mysql('UPDATE accounts SET username = ? WHERE user_id = ?', [
      userName,
      userId,
    ]);

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      ...error,
      action: 'Update Account',
    });
  }
};

module.exports.logoutUser = (req, res) => {
  return res.clearCookie('token').status(200).json({ success: true });
};
