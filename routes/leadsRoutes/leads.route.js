const {getAllLeads, getOneLead, updateLead, addLead,deleteLead} = require('../../controllers/leadsControllers/leads.controller');

module.exports = (app) => {
  app.get('/leads', getAllLeads); //gets all leads. Requires no params
  app.get('/leads/:id', getOneLead); //gets 1 lead. Requires (ID)
  app.post('/leads/create', addLead); //creates one lead. Requires no params
  app.put('/leads/update/:id', updateLead); //updates a lead. Requires (ID)
  app.delete('/leads/delete/:id', deleteLead); //deletes a lead. Requires (ID)
};
