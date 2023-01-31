const {
  getLeague,
  updateLeague,
  createLeague,
  deleteLeague,
  getAllLeagues,
  joinLeague,
  getScoreboard,
} = require('../../controllers/leagueControllers/league.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/league/view', authenticateToken, getAllLeagues);
  app.get('/league/:league_id', authenticateToken, getLeague);
  app.post('/league/create', authenticateToken, createLeague);
  app.put('/league/join/:league_id', authenticateToken, joinLeague);
  app.put('/league/:league_id', authenticateToken, updateLeague);
  app.delete('/league/:league_id', authenticateToken, deleteLeague);
  app.get('/league/scoreboard/:league_id', authenticateToken, getScoreboard);
};
