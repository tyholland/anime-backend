const {
  getLeague,
  updateLeague,
  createLeague,
  deleteLeague,
  getAllLeagues,
  joinLeague,
} = require('../../controllers/leagueControllers/league.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/league/view/:userId', authenticateToken, getAllLeagues);
  app.get('/league/:id', authenticateToken, getLeague);
  app.post('/league/create', authenticateToken, createLeague);
  app.post('/league/join/:id', authenticateToken, joinLeague);
  app.put('/league/:id', authenticateToken, updateLeague);
  app.delete('/league/:id', authenticateToken, deleteLeague);
};
