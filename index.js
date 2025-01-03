/**
 * Required External Modules
 */

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const { middleware } = require('./utils/jwt');
const session = require('express-session');
const errorhandler = require('errorhandler');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

/**
 * App Variables
 */

const PORT = process.env.PORT || 3001;
const app = express();
const originUrl = process.env.ORIGIN_URL;

/**
 *  App Configuration
 */
app.use(express.static('./build'));
app.use(express.static('./doc'));
app.use(
  cors({
    origin: originUrl,
    credentials: true,
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(middleware());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET',
  })
);
app.use(errorhandler());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', originUrl);
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type,set-cookie'
  );
  next();
});

app.get('/doc', (req, res) => {
  const indexFile = path.resolve('./doc/index.html');

  fs.readFile(indexFile, 'utf8', (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Oops, better luck next time!');
    }

    return res.send(data);
  });
});

/**
 * Server Activation
 */

require('./routes/routes')(app);

app.listen(PORT, async () => {
  console.log(`Server is listening on port ${PORT}`);
});
