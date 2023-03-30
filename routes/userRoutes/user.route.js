const {
  createUser,
  deleteAccount,
  loginUser,
  logoutUser,
  checkUserExists,
  adminDashboard,
  playerFormula,
} = require('./../../controllers/userControllers/user.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.post('/users/create', createUser);
  app.post('/users/login', loginUser);
  app.put('/users/exists', checkUserExists);
  app.post('/users/logout', logoutUser);
  app.delete('/users', authenticateToken, deleteAccount);
  app.get('/admin/dashboard', authenticateToken, adminDashboard);
  app.get('/admin/player/formula/:update', playerFormula);
};
