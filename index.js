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
const cron = require('node-cron');
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
const {
  createBracketFirstRound,
  createBracketSecondRound,
  createBracketThirdRound,
  createBracketFourthRound,
  createBracketFinalRound,
  createBracketChamp,
} = require('./utils/bracket');

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

cron.schedule(
  '0 12 * * Sunday',
  async () => {
    // Start new week or end league
    await startNewWeek();

    // Create playoffs schedule
    await playoffsFirstRound();
    await playoffsSemis();
    await playoffsFinals();
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  }
);

cron.schedule(
  '0 2 * * Sunday',
  async () => {
    // Create team schedule and matchups
    await createSixTeamSchedule();
    await createSevenTeamSchedule();
    await createEightTeamSchedule();
    await createNineTeamSchedule();
    await createTenTeamSchedule();

    // Start Bracket Voting
    await createBracketFirstRound();
    await createBracketSecondRound();
    await createBracketThirdRound();
    await createBracketFourthRound();
    await createBracketFinalRound();
    await createBracketChamp();
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  }
);

cron.schedule(
  '0 2 * * Wednesday',
  async () => {
    // Stop users from changing their roster. Start matchup voting
    await stopRosterStartVoting();
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  }
);

cron.schedule(
  '0 23 * * Saturday',
  async () => {
    // Stop matchup voting
    await stopUserVoting();
    await activateWeeklyAffinity();
  },
  {
    scheduled: true,
    timezone: 'America/New_York',
  }
);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
