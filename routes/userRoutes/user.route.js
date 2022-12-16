const {getAccount, createUser} = require('./../../controllers/userControllers/user.controller');

module.exports = (app) => {
  app.post('/users/create', createUser);
  app.get('/users/:id', getAccount);
};

