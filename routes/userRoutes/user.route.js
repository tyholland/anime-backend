const {
  getAccount,
  createUser,
  deleteAccount,
  updateAccount,
} = require('./../../controllers/userControllers/user.controller');

module.exports = (app) => {
  app.post('/users/create', createUser);
  app.get('/users/:id', getAccount);
  app.delete('/users/:id', deleteAccount);
  app.put('/users/:id', updateAccount);
};

