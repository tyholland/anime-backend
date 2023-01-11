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
  app.get('/league/:id', getLeague);
  app.get('/league/view/:userId', authenticateToken, getAllLeagues);
  app.post('/league/create', createLeague);
  app.post('/league/:id', joinLeague);
  app.put('/league/:id', updateLeague);
  app.delete('/league/:id', deleteLeague);
};
