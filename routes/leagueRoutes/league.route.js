const {getLeague, updateLeague, addLeague,deleteLeague} = require('../../controllers/leagueControllers/league.controller');

module.exports = (app) => {
  app.get('/league/:id', getLeague);
  app.post('/league/create', addLeague);
  app.put('/league/:id', updateLeague);
  app.delete('/league/:id', deleteLeague);
};
