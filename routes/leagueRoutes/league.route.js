const {
  getLeague,
  updateLeague,
  createLeague,
  deleteLeague,
  getAllLeagues,
  joinLeague,
  getScoreboard,
  getStandings,
  startLeague,
  getLeagueAdminData,
} = require('../../controllers/leagueControllers/league.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/league/view', authenticateToken, getAllLeagues);
  app.get('/league/:league_id', authenticateToken, getLeague);
  app.post('/league/create', authenticateToken, createLeague);
  app.put('/league/join', authenticateToken, joinLeague);
  app.put('/league/:league_id', authenticateToken, updateLeague);
  app.delete('/league/:league_id', authenticateToken, deleteLeague);
  app.get('/league/scoreboard/:league_id', authenticateToken, getScoreboard);
  app.get('/league/standings/:league_id', authenticateToken, getStandings);
  app.post('/league/start', authenticateToken, startLeague);
  app.get('/league/admin/settings', authenticateToken, getLeagueAdminData);
};
