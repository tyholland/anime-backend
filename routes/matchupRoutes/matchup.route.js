const {
  getMatchup,
  getMatchupFromTeam,
} = require('../../controllers/matchupControllers/matchup.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/matchup/:matchup_id', authenticateToken, getMatchup);
  app.get('/matchup/team/:team_id', authenticateToken, getMatchupFromTeam);
};
