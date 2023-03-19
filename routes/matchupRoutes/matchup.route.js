const {
  getMatchup,
  getMatchupFromTeam,
  createMatchupVotes,
  getMatchupVotes,
  getAllMatchupVotes,
  addVotes,
} = require('../../controllers/matchupControllers/matchup.controller');
const { authenticateToken } = require('../../utils');
const { cacheThirtyMins } = require('../../utils/cache');
const cache = require('../../utils/cache').instance();

module.exports = (app) => {
  app.get(
    '/matchup/:matchup_id',
    cache(cacheThirtyMins),
    authenticateToken,
    getMatchup
  );
  app.get(
    '/matchup/team/:team_id',
    cache(cacheThirtyMins),
    authenticateToken,
    getMatchupFromTeam
  );
  app.post('/matchup/vote/:matchup_id', authenticateToken, createMatchupVotes);
  app.get('/matchup/votes/:vote_id', getMatchupVotes);
  app.put('/matchup/all/votes', getAllMatchupVotes);
  app.put('/matchup/add', authenticateToken, addVotes);
};
