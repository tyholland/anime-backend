const {
  getDraft,
  updateDraftTeams,
  createDraft,
  startDraft,
  updateDraftRecentPick,
  draftNextRound,
} = require('../../controllers/draftControllers/draft.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/draft/:league_id', authenticateToken, getDraft);
  app.put('/draft/teams/:draft_id', authenticateToken, updateDraftTeams);
  app.put('/draft/recent/:draft_id', authenticateToken, updateDraftRecentPick);
  app.post('/draft/create/:league_id', authenticateToken, createDraft);
  app.get('/draft/start/:league_id', authenticateToken, startDraft);
  app.get('/draft/rounds/:league_id', authenticateToken, draftNextRound);
};
