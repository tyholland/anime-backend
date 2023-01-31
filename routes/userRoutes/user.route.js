const {
  createUser,
  deleteAccount,
  loginUser,
  logoutUser,
} = require('./../../controllers/userControllers/user.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.post('/users/create', createUser);
  app.post('/users/login', loginUser);
  app.post('/users/logout', logoutUser);
  app.delete('/users', authenticateToken, deleteAccount);
};
