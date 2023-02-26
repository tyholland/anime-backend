const {
  getAllPlayers,
  getPlayer,
  getPlayablePlayers,
} = require('../../controllers/playerControllers/player.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/player', getAllPlayers);
  app.get('/player/:player_id', getPlayer);
  app.get('/player/select/:team_id', authenticateToken, getPlayablePlayers);
};
