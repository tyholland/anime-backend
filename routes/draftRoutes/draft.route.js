const {
  getDraft,
  updateDraftTeams,
} = require('../../controllers/draftControllers/draft.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/draft/:league_id', authenticateToken, getDraft);
  app.put('/draft/teams/:draft_id', authenticateToken, updateDraftTeams);
};
