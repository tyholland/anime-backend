const {
  getDraft,
  createDraft,
  startDraft,
  draftNextRound,
  addDraftPlayers,
} = require('../../controllers/draftControllers/draft.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/draft/:league_id', authenticateToken, getDraft);
  app.post('/draft/create/:league_id', authenticateToken, createDraft);
  app.get('/draft/start/:league_id', authenticateToken, startDraft);
  app.get('/draft/rounds/:league_id', authenticateToken, draftNextRound);
  app.put('/draft/players/:team_id', authenticateToken, addDraftPlayers);
};
