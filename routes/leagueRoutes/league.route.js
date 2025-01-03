const {
  getLeague,
  updateLeague,
  createLeague,
  deleteLeague,
  getAllLeagues,
  joinLeague,
  getScoreboard,
  getStandings,
  getLeagueAdminData,
  removeTeamFromLeague,
  getPlayoffsSchedule,
  getLeagueChamp
} = require('../../controllers/leagueControllers/league.controller');
const { authenticateToken } = require('../../utils');
const { cacheFiveMins, cacheThirtyMins } = require('../../utils/cache');
const cache = require('../../utils/cache').instance();

module.exports = (app) => {
  app.get(
    '/league/view',
    cache(cacheFiveMins),
    authenticateToken,
    getAllLeagues
  );
  app.get(
    '/league/:league_id',
    cache(cacheFiveMins),
    authenticateToken,
    getLeague
  );
  app.post('/league/create', authenticateToken, createLeague);
  app.put('/league/join', authenticateToken, joinLeague);
  app.put('/league/:league_id', authenticateToken, updateLeague);
  app.delete('/league/:league_id', authenticateToken, deleteLeague);
  app.get(
    '/league/scoreboard/:league_id',
    cache(cacheFiveMins),
    authenticateToken,
    getScoreboard
  );
  app.get(
    '/league/standings/:league_id',
    cache(cacheFiveMins),
    authenticateToken,
    getStandings
  );
  app.get(
    '/league/admin/settings/:league_id',
    cache(cacheFiveMins),
    authenticateToken,
    getLeagueAdminData
  );
  app.delete(
    '/league/remove/:member_id',
    authenticateToken,
    removeTeamFromLeague
  );
  app.get(
    '/league/playoffs/:league_id',
    cache(cacheFiveMins),
    authenticateToken,
    getPlayoffsSchedule
  );
  app.get(
    '/league/champion/:league_id',
    cache(cacheThirtyMins),
    authenticateToken,
    getLeagueChamp
  );
};
