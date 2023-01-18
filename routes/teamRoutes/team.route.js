const {
  getTeam,
  getTeamInfo,
  updateTeam,
  updateTeamName,
  getMatchupTeam,
} = require('../../controllers/teamControllers/team.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/team/data/:team_id', authenticateToken, getTeam);
  app.get('/team/matchup/:team_id', authenticateToken, getMatchupTeam);
  app.get('/team/info/:member_id', authenticateToken, getTeamInfo);
  app.put('/team/name/:member_id', authenticateToken, updateTeamName);
  app.put('/team/:team_id', authenticateToken, updateTeam);
};
