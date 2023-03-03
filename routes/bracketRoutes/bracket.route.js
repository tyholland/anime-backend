const {
  createBracket,
  addVotes,
  getBracket,
  getAllBrackets,
} = require('../../controllers/bracketControllers/bracket.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.post('/bracket/create', authenticateToken, createBracket);
  app.put('/bracket/add', authenticateToken, addVotes);
  app.get('/bracket/:bracket_id', getBracket);
  app.get('/bracket/all/items', authenticateToken, getAllBrackets);
};
