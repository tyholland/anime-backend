const {
  getAllPlayers,
  getPlayer,
  getPlayablePlayers,
  getAnimeNews,
  updatePlayer,
} = require('../../controllers/playerControllers/player.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/player', getAllPlayers);
  app.get('/player/:player_id', getPlayer);
  app.get('/player/select/:team_id', authenticateToken, getPlayablePlayers);
  app.post('/player/update', authenticateToken, updatePlayer);
  app.get('/player/anime/news', getAnimeNews);
};
