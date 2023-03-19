const {
  createUser,
  deleteAccount,
  loginUser,
  logoutUser,
  checkUserExists,
  adminDashboard,
} = require('./../../controllers/userControllers/user.controller');
const { authenticateToken } = require('../../utils');
const { cacheOneDay } = require('../../utils/cache');
const cache = require('../../utils/cache').instance();

module.exports = (app) => {
  app.post('/users/create', createUser);
  app.post('/users/login', loginUser);
  app.put('/users/exists', checkUserExists);
  app.post('/users/logout', logoutUser);
  app.delete('/users', authenticateToken, deleteAccount);
  app.get(
    '/admin/dashboard',
    cache(cacheOneDay),
    authenticateToken,
    adminDashboard
  );
};
