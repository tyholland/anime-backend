const {
  startRule,
  affinityRule,
  voteRule,
  scheduleRule,
  roundOne
} = require('../../controllers/cronJobControllers/cronJob.controller.js');

module.exports = (app) => {
  app.get('/cron/affinity', affinityRule);
  app.get('/cron/start', startRule);
  app.get('/cron/vote', voteRule);
  app.get('/cron/schedule', scheduleRule);
  app.get('/cron/round1', roundOne);
};
