const {getAllCharacters} = require('../../controllers/characterControllers/character.controller');

module.exports = (app) => {
  app.get('/character', getAllCharacters);
};

