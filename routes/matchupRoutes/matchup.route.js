const {
  getMatchup,
} = require('../../controllers/matchupControllers/matchup.controller');

module.exports = (app) => {
  app.get('/matchup/:matchup_id', getMatchup);
};
