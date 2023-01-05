const {
  getTeam,
  getTeamInfo,
  updateTeam,
  updateTeamName,
} = require('../../controllers/teamControllers/team.controller');

module.exports = (app) => {
  app.get('/team/info/:member_id', getTeamInfo);
  app.get('/team/:league_id/:id', getTeam);
  app.put('/team/name/:member_id', updateTeamName);
  app.put('/team/:id', updateTeam);
};
