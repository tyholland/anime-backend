const {
  createBracket,
  addVotes,
} = require('../../controllers/bracketControllers/bracket.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.post('/bracket/create', authenticateToken, createBracket);
  app.put('/bracket/add', authenticateToken, addVotes);
};
