const {getAccount, addUser} = require('./../../controllers/userControllers/user.controller');

module.exports = (app) => {
  app.post('/users/create', addUser);
  app.post('/users/account', getAccount);
};

