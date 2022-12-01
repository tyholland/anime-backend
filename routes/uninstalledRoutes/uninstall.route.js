const {getAllUninstalled, getOneUninstalled, addUninstalled, updateUninstalled, deleteUninstalled} = require('./../../controllers/uninstalledControllers/uninstalled.controller');

module.exports = (app) =>{
  app.get('/uninstalled', getAllUninstalled); // gets all uninstalled users. Requires no params
  app.get('/uninstalled/:id', getOneUninstalled); // gets 1 uninstalled user. Requires (ID)
  app.post('/uninstalled/create', addUninstalled); // creates an uninstalled user. Requires no params
  app.put('/uninstalled/update/:id', updateUninstalled); // updates an uninstalled user. Requires (ID)
  app.delete('/uninstalled/delete/:id', deleteUninstalled); // deletes an uninstalled user. Requires (ID)
};
