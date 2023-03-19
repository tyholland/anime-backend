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
const { cacheOneWeek, cacheOneDay } = require('../../utils/cache');
const cache = require('../../utils/cache').instance();

module.exports = (app) => {
  app.get('/player', cache(cacheOneWeek), getAllPlayers);
  app.get(
    '/admin/player',
    cache(cacheOneWeek),
    authenticateToken,
    getAdminPlayers
  );
  app.get('/player/:player_id', cache(cacheOneWeek), getPlayer);
  app.get(
    '/player/select/:team_id',
    cache(cacheOneDay),
    authenticateToken,
    getPlayablePlayers
  );
  app.put('/player/update', authenticateToken, updatePlayer);
  app.post('/player/add', authenticateToken, addPlayer);
  app.get('/player/anime/news', cache(cacheOneWeek), getAnimeNews);
};
