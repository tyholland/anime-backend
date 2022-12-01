const {getAllUser, loginUser, addUser, updateUser, deleteUser, forgotPassword, getOneUserEmail, contactUs} = require('./../../controllers/userControllers/user.controller');
const {authenticateToken} = require('../../utils/index');


module.exports = (app) => {
  app.get('/users', getAllUser); // gets all users. Requires no params
  app.get('/user', authenticateToken, getOneUserEmail); //gets one user by email. The email will be bound to a token
  app.post('/users/login', loginUser); // login user and generate token
  app.post('/users/create', authenticateToken, addUser); // creates one user. Requires no params
  app.put('/users/update', authenticateToken, updateUser); // updates a user. Requires no params
  app.delete('/users/delete', authenticateToken,  deleteUser); // deletes a user. Requires no params
  app.post('/users/forgotPassword', forgotPassword); //sets temp password in db and emails to user
  app.post('/users/contactUs', contactUs); // creates contact in db, emails sales with message
};

