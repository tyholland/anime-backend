const { googleLogin } = require('../../controllers/googleController/google.controller');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { google, googleCallback } = require('../../config');

module.exports = (app) => {
  let userProfile;

  app.use(passport.initialize());
  app.use(passport.session());

  /**
   * PASSPORT SETUP
   **/

  passport.serializeUser((user, cb) => {
    cb(null, user);
  });

  passport.deserializeUser((obj, cb) => {
    cb(null, obj);
  });

  /**
   * Google AUTH
   **/

  passport.use(
    new GoogleStrategy(
      {
        clientID: google.clientId,
        clientSecret: google.clientSecret,
        callbackURL: googleCallback
      },
      (accessToken, refreshToken, profile, done) => {
        userProfile = profile;
        return done(null, userProfile);
      }
    )
  );

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] })); //main google login endpoint
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/error' }), googleLogin); // google callback
  app.get('/error', (req, res) => res.send('error logging in')); // google error
};
