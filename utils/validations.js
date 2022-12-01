/* eslint-disable no-useless-escape */
const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const knex = require('./knex').instance();
const bcrypt = require('bcryptjs');

module.exports.validateInput = (info) => {
  //maybe change name to validate newUser or something.
  let output = [];
  // Email Validation
  if (info.email) {
    if (!emailPattern.test(info.email)) output.push({ type: 'email', message: 'Enter a valid email!' });
  }
  // Zip Validation
  if (info.zip) {
    const zipDigitCount = info.zip.match(/\d/g)?.length || 0;
    if (info.zip.length !== 5 || zipDigitCount !== 5) output.push({ type: 'zip', message: 'Enter a valid zip!' });
  }
  // Validate Phone
  if (info.phone) {
    const digitCount = info.phone.match(/\d/g)?.length || 0;
    if (info.phone.length !== 10 || digitCount !== 10) output.push({ type: 'phone', message: 'Enter a valid phone number!' });
  }

  return output;
};

module.exports.validateLogin = async (loginUser) => {
  let output = [];
  if (!loginUser.email || !loginUser.password) {
    output.push({ type: 'Empty fields', message: 'Please fill out required fields' });
    return output;
  }

  const user = await knex('users').where('email', loginUser.email);
  if(!bcrypt.compareSync(loginUser.password, user[0].password)){
    output.push({type: 'Invalid', message: 'Invalid Credentials'});
    return output;
  }
  return output;
};
