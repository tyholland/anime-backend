const {
  getAllPlayers,
  getPlayer,
  getPlayablePlayers,
  getAnimeNews,
  updatePlayer,
  addPlayer,
  getAdminPlayers,
} = require('../../controllers/playerControllers/player.controller');
const { authenticateToken } = require('../../utils');

module.exports = (app) => {
  app.get('/player', getAllPlayers);
  app.get('/admin/player', authenticateToken, getAdminPlayers);
  app.get('/player/:player_id', getPlayer);
  app.get('/player/select/:team_id', authenticateToken, getPlayablePlayers);
  app.put('/player/update', authenticateToken, updatePlayer);
  app.post('/player/add', authenticateToken, addPlayer);
  app.get('/player/anime/news', getAnimeNews);
};
