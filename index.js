/**
 * Required External Modules
 */

const fs = require('fs');
const express = require('serverless-express/express');
const cors = require('cors');
const path = require('path');
const { middleware } = require('./utils/jwt');
const session = require('express-session');
const errorhandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');

/**
 * App Variables
 */

const PORT = process.env.PORT || 3000;
const app = express();

/**
 *  App Configuration
 */
app.use(express.static('./build'));
app.use(express.static('./doc'));
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(middleware());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
  })
);
app.use(errorhandler());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,set-cookie');
  next();
});

app.get('/doc', (req, res) => {
  const indexFile = path.resolve('./doc/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Something went wrong:', err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(data);
  });
});

/**
 * Server Activation
 */

require('./routes/routes')(app);

if (config.serverEnv !== 'prod') {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

if (config.serverEnv === 'prod') {
  module.exports = app;
}
