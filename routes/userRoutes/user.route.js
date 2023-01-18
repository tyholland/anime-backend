const {
  getAccount,
  createUser,
  deleteAccount,
  updateAccount,
  loginUser,
  logoutUser,
} = require('./../../controllers/userControllers/user.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.post('/users/create', createUser);
  app.post('/users/login', loginUser);
  app.get('/users/logout', logoutUser);
  app.get('/users', authenticateToken, getAccount);
  app.delete('/users', authenticateToken, deleteAccount);
  app.put('/users', authenticateToken, updateAccount);
};
