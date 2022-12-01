module.exports.knex = {
  host: process.env.DB_HOST || process.env.REACT_APP_DB_HOST,
  user: process.env.DB_USER || process.env.REACT_APP_DB_USER,
  password: process.env.DB_PWD || process.env.REACT_APP_DB_PWD,
  database: process.env.DB_NAME || process.env.REACT_APP_DB_NAME,
};
module.exports.secret = process.env.SECRET || process.env.REACT_APP_SECRET;
module.exports.stripe = process.env.STRIPE || process.env.REACT_APP_STRIPE;
module.exports.imgBucket = process.env.IMG_URL || process.env.REACT_APP_IMG_URL;
module.exports.amplitude = {
  key: process.env.AMP_KEY || process.env.REACT_APP_AMP_KEY,
};
module.exports.googleRedirect = process.env.GOOGLE_REDIRECT || process.env.REACT_APP_GOOGLE_REDIRECT;
module.exports.googleCallback = process.env.GOOGLE_CALLBACK || process.env.REACT_APP_GOOGLE_CALLBACK;
module.exports.google = {
  clientId: process.env.GOOGLE_ID || process.env.REACT_APP_GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET || process.env.REACT_APP_GOOGLE_SECRET,
};
module.exports.serverEnv = process.env.SERVER_ENV || process.env.REACT_APP_SERVER_ENV;
module.exports.emailUsername = process.env.EMAIL_USERNAME || process.env.REACT_APP_EMAIL_USERNAME;
module.exports.emailSMTPPassword = process.env.EMAIL_PASSWORD || process.env.REACT_APP_EMAIL_PASSWORD;
