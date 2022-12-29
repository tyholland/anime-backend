const {
  getTeam,
  updateTeam,
  updateTeamName,
} = require('../../controllers/teamControllers/team.controller');

module.exports = (app) => {
  app.get('/team/:league_id/:id', getTeam);
  app.put('/team/name/:id', updateTeamName);
  app.put('/team/:id', updateTeam);
};
