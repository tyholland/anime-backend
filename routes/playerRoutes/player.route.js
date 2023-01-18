const {
  getAllPlayers,
  getPlayer,
} = require('../../controllers/playerControllers/player.controller');

module.exports = (app) => {
  app.get('/player', getAllPlayers);
  app.get('/player/:player_id', getPlayer);
};
