const {getAllPlayers} = require('../../controllers/playerControllers/player.controller');

module.exports = (app) => {
  app.get('/player', getAllPlayers);
};

