const {
  getAllPlayers,
  getPlayer,
  getPlayablePlayers,
  getAnimeNews,
} = require('../../controllers/playerControllers/player.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/player', getAllPlayers);
  app.get('/player/:player_id', getPlayer);
  app.get('/player/select/:team_id', authenticateToken, getPlayablePlayers);
  app.get('/player/anime/news', getAnimeNews);
};
