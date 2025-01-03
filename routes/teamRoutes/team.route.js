const {
  getTeam,
  getTeamInfo,
  updateTeam,
  updateTeamName,
  getMatchupTeam,
  getSchedule,
  removeTeam,
  hideWeekRecap,
} = require('../../controllers/teamControllers/team.controller');
const { authenticateToken } = require('../../utils');
const { cacheOneDay, cacheFiveMins } = require('../../utils/cache');
const cache = require('../../utils/cache').instance();

module.exports = (app) => {
  app.get('/team/data/:team_id', authenticateToken, getTeam);
  app.get('/team/matchup/:team_id', authenticateToken, getMatchupTeam);
  app.get(
    '/team/info/:member_id',
    cache(cacheOneDay),
    authenticateToken,
    getTeamInfo
  );
  app.put('/team/name/:member_id', authenticateToken, updateTeamName);
  app.put('/team/:team_id', authenticateToken, updateTeam);
  app.get(
    '/team/schedule/:league_id',
    cache(cacheFiveMins),
    authenticateToken,
    getSchedule
  );
  app.delete('/team/:league_id', authenticateToken, removeTeam);
  app.put('/team/recap/:league_id', authenticateToken, hideWeekRecap);
};
