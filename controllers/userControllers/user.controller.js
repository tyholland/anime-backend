const { secret } = require('../../config/index');
const knex = require('../../utils/knex').instance();
const bcrypt = require('bcryptjs');
const { validateInput, validateLogin } = require('../../utils/validations');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../../utils/mailer');

//Get all
module.exports.getAllUser = (req, res) => { //Make this admin route for an admin panel maybe?
  knex('users')
    .select('*')
    .then((allUsers) => res.status(200).json(allUsers))
    .catch((err) => res.status(500).json(err));
};


//Get one user by Email
module.exports.getOneUserEmail = (req, res) => {
  //This has an authenticate token method before, which adds user to req.  
  knex('users')
    .where({ email: req.user.email }) 
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
};

//Login user
module.exports.loginUser = async (req, res) => {
  const checkValidate = await validateLogin(req.body); //Validates the users login. Returns a list
  if (checkValidate.length > 0) return res.status(401).json(checkValidate); // Checks if list contains anything. Returns if it does. 
  const user = { email: req.body.email }; //Destructure user so we can sign it with JWT
  const accessToken = jwt.sign(user, secret, {expiresIn: '7d'}); //Signs user email to a JWT
  return(
    res.status(201)
    //!!!We will need one of the pop ups that tells users we do this!!!
      .cookie('token', accessToken, //The name of the cookie that is stored in the browsers cookie storage. 
        {
          httpOnly: true, //httpOnly means, only web server can access it. Preventing certain hacks.
          secure: true, //Secure means, the cookie will be sent with https
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) //Tells browser to store the cookie for 604,800,000 ms. Which is equal to one week. 
        })
      .json(accessToken) //Sends back the access token to the frontend. Maybe this goes.
  ); 
};

//Create a user
module.exports.addUser = async (req, res) => { //Needs jwt somehow
  const checkValidate = validateInput(req.body);
  if (checkValidate.length > 0) {
    return res.status(400).json(checkValidate);
  }
  // const {} = req.body;
  let hashed = bcrypt.hashSync(req.body.password, 8);
  knex('users')
    .insert(
      {
        username: req.body.username,
        email: req.body.email,
        password: hashed,
        created_on: new Date(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        race: req.body.race,
        gender: req.body.gender,
        phone: req.body.phone,
        zip: req.body.zip,
        categories: req.body.categories,
        favorites: req.body.favorites
      },
      ['user_id', 'username', 'email', 'first_name', 'last_name', 'age', 'race', 'gender', 'phone', 'zip', 'categories', 'favorites']
    )
    .then((user) => res.status(200).json(user[0]))
    .catch((err) => res.status(500).json(err));
};

//Update a user
module.exports.updateUser = (req, res) => {
  const checkValidate = validateInput(req.body);
  if (checkValidate.length > 0) {
    return res.status(400).json(checkValidate);
  }
  //This has an authenticate token method before, which adds user to req. 
  knex('users')
    .where({ email: req.user.email })
    .update(
      {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        created_on: new Date(),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        age: req.body.age,
        race: req.body.race,
        gender: req.body.gender,
        phone: req.body.phone,
        zip: req.body.zip,
        categories: req.body.categories,
        favorites: req.body.favorites
      },
      ['user_id', 'username', 'email', 'first_name', 'last_name', 'age', 'race', 'gender', 'phone', 'zip', 'categories', 'favorites']
    )
    .then((user) => res.status(200).json(user[0]))
    .catch((err) => res.status(500).json(err));
};

//Delete a user
module.exports.deleteUser = (req, res) => {
  //This has an authenticate token method before, which adds user to req. 
  knex('users')
    .where({ email: req.user.email })
    .del()
    .then((user) => res.status(200).json(user))
    .catch((err) => res.status(500).json(err));
};

//Send temporary password to given email
module.exports.forgotPassword = async (req, res) => {
  //check that email is valid
  const checkValidate = validateInput(req.body);
  if (checkValidate.length > 0) {
    return res.status(400).json(checkValidate);
  }

  //set up message and generate temporary password
  var subject = 'Password Reset';
  var tempPass = Math.random().toString(36).slice(-8);
  var text = 'Your temporary password is ' + tempPass;
  let hashedTempPass = await bcrypt.hash(tempPass, 8);

  //set temp password in db
  await knex.schema.raw(`UPDATE users SET password = '${hashedTempPass}' WHERE email = '${req.body.email}';`);

  //send the email with the password
  var sent = await sendEmail('info@freedomrains.com', req.body.email, subject, text);

  if (sent)
    return res.status(200).end();
  else
    return res.status(500).end();
};

module.exports.contactUs = async (req, res) => {
  //error checking
  const checkValidate = validateInput(req.body);
  if (checkValidate.length > 0) {
    return res.status(400).json(checkValidate);
  }

  //save to db
  await knex('contacts')
    .insert(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        phone: req.body.phone,
        industry: req.body.industry,
        website: req.body.website,
        service: req.body.service
      },
      ['contact_id', 'first_name', 'last_name', 'email', 'phone', 'industry', 'website', 'service']
    )
    .catch((err) => res.status(500).json(err));

  //build text for email and send to info@freedomrains.com
  var subject = `Message from '${req.body.email}'`;
  var text = 'Name: ' + req.body.first_name + ' ' + req.body.last_name + '\n' +
             'Email: ' + ' ' + req.body.email + '\n' +
             'Phone #: ' + ' ' + req.body.phone + '\n' +
             'Industry: ' + ' ' + req.body.industry + '\n' +
             'Website: ' + ' ' + req.body.website + '\n' +
             'Service: ' + ' ' + req.body.service + '\n' +
             'Message: ' + ' ' + req.body.message;
  var sent = await sendEmail(req.body.email, 'info@freedomrains.com', subject, text);

  if (sent)
    return res.status(200).end();
  else
    return res.status(500).end();
};
