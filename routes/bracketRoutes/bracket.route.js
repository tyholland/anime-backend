const {
  createBracket,
  addVotes,
  getBracket,
  getAllBrackets,
  startRound1,
  startRound2,
  startRound3,
  startRound4,
  getTheChamp,
  startChampRound,
} = require('../../controllers/bracketControllers/bracket.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.post('/bracket/create', authenticateToken, createBracket);
  app.put('/bracket/add', addVotes);
  app.get('/bracket/:bracket_id', getBracket);
  app.get('/bracket/all/items', authenticateToken, getAllBrackets);
  app.get('/bracket/round1/:bracket_id', authenticateToken, startRound1);
  app.get('/bracket/round2/:bracket_id', authenticateToken, startRound2);
  app.get('/bracket/round3/:bracket_id', authenticateToken, startRound3);
  app.get('/bracket/round4/:bracket_id', authenticateToken, startRound4);
  app.get('/bracket/round5/:bracket_id', authenticateToken, startChampRound);
  app.get('/bracket/champ/:bracket_id', getTheChamp);
};
