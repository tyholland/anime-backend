const mysql = require('../../utils/mysql').instance();
const jwt = require('jsonwebtoken');
const { validateEmail } = require('../../utils');
const secret = process.env.SECRET;
const { addMemberToList } = require('../../utils/mailchimp');

module.exports.checkUserExists = async (req, res) => {
  const { firebaseId, email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE firebase_uid = ? AND email = ?',
      [firebaseId, email]
    );

    return res.status(200).json({
      exists: !!account.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Check if User exists',
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const { firebaseId, email } = req.body;

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE firebase_uid = ? AND email = ?',
      [firebaseId, email]
    );

    if (!account.length) {
      return res.status(400).json({
        message: 'User does not exist',
      });
    }

    const user = {
      email,
      userId: account[0].user_id,
      firebaseId,
    };
    const accessToken = jwt.sign(user, secret);

    return res.status(200).json({
      ...account[0],
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Login User',
    });
  }
};

module.exports.createUser = async (req, res) => {
  const { email, firebaseId } = req.body;
  const date = new Date().toISOString();

  if (!validateEmail(email)) {
    return res.status(400).json({
      message: 'Please enter a valid email address',
    });
  }

  try {
    const user = await mysql(
      'SELECT * FROM users WHERE email = ? AND active = ?',
      [email, 1]
    );

    if (user[0]?.email === email) {
      return res.status(400).json({
        message: 'User\'s email already exists',
      });
    }

    const oldUser = await mysql(
      'SELECT email, id as user_id FROM users WHERE email = ? AND active = ?',
      [email, 0]
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

      return res.status(200).json({
        ...oldUser[0],
        token: accessToken,
      });
    }

    const newUser = await mysql(
      'INSERT INTO `users` (`email`, `firebase_uid`, `create_date`) VALUES (?, ?, ?)',
      [email, firebaseId, date]
    );

    const account = await mysql(
      'SELECT email, id as user_id FROM users WHERE id = ?',
      [newUser.insertId]
    );

    await addMemberToList(account[0].email);

    const accessObj = {
      email: account[0].email,
      userId: account[0].user_id,
      firebaseUID: firebaseId,
    };
    const accessToken = jwt.sign(accessObj, secret);

    return res.status(200).json({
      ...account[0],
      token: accessToken,
    });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return res.status(500).json({
      error,
      action: 'Delete Account',
    });
  }
};

module.exports.logoutUser = (req, res) => {
  return res.clearCookie('__session').status(200).json({ success: true });
};
