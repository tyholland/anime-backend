const {
  getLeague,
  updateLeague,
  createLeague,
  deleteLeague,
  getAllLeagues,
  joinLeague,
} = require('../../controllers/leagueControllers/league.controller');

module.exports = (app) => {
  app.get('/league/:id', getLeague);
  app.get('/league/view/:userId', getAllLeagues);
  app.post('/league/create', createLeague);
  app.post('/league/:id', joinLeague);
  app.put('/league/:id', updateLeague);
  app.delete('/league/:id', deleteLeague);
};
