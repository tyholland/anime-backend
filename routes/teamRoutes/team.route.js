const {
  getTeam,
  getTeamInfo,
  updateTeam,
  updateTeamName,
} = require('../../controllers/teamControllers/team.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/team/info/:member_id', authenticateToken, getTeamInfo);
  app.get('/team/:league_id/:id', getTeam);
  app.put('/team/name/:member_id', authenticateToken, updateTeamName);
  app.put('/team/:id', authenticateToken, updateTeam);
};
