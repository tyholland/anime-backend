const {
  getAccount,
  createUser,
  deleteAccount,
  updateAccount,
  loginUser,
} = require('./../../controllers/userControllers/user.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.post('/users/create', createUser);
  app.post('/users/login', loginUser);
  app.get('/users/:id', authenticateToken, getAccount);
  app.delete('/users/:id', authenticateToken, deleteAccount);
  app.put('/users/:id', authenticateToken, updateAccount);
};
