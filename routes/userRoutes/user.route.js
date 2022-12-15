const {getAccount, addUser} = require('./../../controllers/userControllers/user.controller');

module.exports = (app) => {
  app.post('/users/create', addUser);
  app.get('/users/:id', getAccount);
};

