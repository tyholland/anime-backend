const {addGamer, getGamer, updateGamer, deleteGamer} = require('../../controllers/gamingControllers/gaming.controller');

module.exports = (app) => {
  app.post('/gaming/create', addGamer); //creates a gamer. Requires body
  app.get('/gaming/user', getGamer); //gets all the gamers
  app.put('/gaming/update/:id', updateGamer); //updates gamer. requires body
  app.delete('/gaming/delete/:id',deleteGamer); //deletes gamer. 
};
