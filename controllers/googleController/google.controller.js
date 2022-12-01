const knex = require('../../utils/knex').instance();
const { secret, googleRedirect } = require('../../config');
const jwt = require('jsonwebtoken');

module.exports.googleLogin = (req, res) => {
  const {
    user: {
      _json: { email, given_name, family_name, email_verified },
    },
  } = req;

  //if email not verified by google, fail
  //add failure page here?
  if (!email_verified) {
    res.status(500).json([
      {
        type: 'Invalid',
        message: 'Google Failed to Verify'
      }
    ]);
  }

  //check if this email has an account
  //if so, login
  //if not, create an account
  knex('users')
    .where({ email })
    .then(
      async (loginGoogleUser) => {
        //user doesn't yet have an account
        if(!loginGoogleUser[0]){
          knex('users')
            .insert(
              {
                username: email,
                email: email,
                created_on: new Date(),
                first_name: given_name,
                last_name: family_name,
              },
              ['user_id', 'username', 'email', 'first_name', 'last_name']
            )
            .then(async function(user_id, email) {
              //create and insert token into db
              const token = jwt.sign({ sub: user_id }, secret, {expiresIn: '7d', });
              await knex.schema.raw(`UPDATE users SET token = '${token}' WHERE user_id = '${user_id}';`);

              //redirect user after successful login
              res.redirect(
                `${googleRedirect}/?google-data=${encodeURI(token
                )}&user=${encodeURI(email)}`
              );
            });
        }
        //user has an account
        else if(loginGoogleUser[0]){
          //update their token and sign them in
          const token = jwt.sign({ sub: loginGoogleUser[0].user_id }, secret, {expiresIn: '7d', });

          knex('users')
            .where({ email })
            .then(async (loginGoogleUser) => {
              await knex.schema.raw(`UPDATE users SET token = '${token}' WHERE user_id = '${loginGoogleUser[0].user_id}';`);
              //redirect with new token
              res.redirect(
                `${googleRedirect}/?google-data=${encodeURI(token
                )}&user=${encodeURI(loginGoogleUser[0].username)}`
              );
            });
        }
      }
    );

};
