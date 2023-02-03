const {
  getMatchup,
  getMatchupFromTeam,
  createMatchupVotes,
  getMatchupVotes,
  getAllMatchupVotes,
  addVotes,
} = require('../../controllers/matchupControllers/matchup.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/matchup/:matchup_id', authenticateToken, getMatchup);
  app.get('/matchup/team/:team_id', authenticateToken, getMatchupFromTeam);
  app.post('/matchup/vote/:matchup_id', authenticateToken, createMatchupVotes);
  app.get('/matchup/votes/:vote_id', getMatchupVotes);
  app.get('/matchup/all/votes', getAllMatchupVotes);
  app.put('/matchup/add', authenticateToken, addVotes);
};
