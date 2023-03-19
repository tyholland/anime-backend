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
const cron = require('node-schedule');
const {
  startNewWeek,
  stopRosterStartVoting,
  stopUserVoting,
  activateWeeklyAffinity,
} = require('./utils/query');
const {
  createSixTeamSchedule,
  createSevenTeamSchedule,
  createEightTeamSchedule,
  createNineTeamSchedule,
  createTenTeamSchedule,
  playoffsFirstRound,
  playoffsSemis,
  playoffsFinals,
} = require('./utils/schedule');

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

const startRule = new cron.RecurrenceRule();
startRule.hour = 12;
startRule.minute = 0;
startRule.tz = 'America/New_York';
startRule.dayOfWeek = 0;

const scheduleRule = new cron.RecurrenceRule();
scheduleRule.hour = 9;
scheduleRule.minute = 0;
scheduleRule.tz = 'America/New_York';
scheduleRule.dayOfWeek = 0;

const voteRule = new cron.RecurrenceRule();
voteRule.hour = 9;
voteRule.minute = 12;
voteRule.tz = 'America/New_York';
voteRule.dayOfWeek = 3;

const affinityRule = new cron.RecurrenceRule();
affinityRule.hour = 8;
affinityRule.minute = 0;
affinityRule.tz = 'America/New_York';
affinityRule.dayOfWeek = 0;

cron.scheduleJob(startRule, async () => {
  // Start new week or end league
  await startNewWeek();

  // Create playoffs schedule
  await playoffsFirstRound();
  await playoffsSemis();
  await playoffsFinals();
});

cron.scheduleJob(scheduleRule, async () => {
  // Create team schedule and matchups
  await createSixTeamSchedule();
  await createSevenTeamSchedule();
  await createEightTeamSchedule();
  await createNineTeamSchedule();
  await createTenTeamSchedule();
});

cron.scheduleJob(voteRule, async () => {
  // Stop users from changing their roster. Start matchup voting
  await stopRosterStartVoting();
});

cron.scheduleJob(affinityRule, async () => {
  // Stop matchup voting
  await stopUserVoting();
  await activateWeeklyAffinity();
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
