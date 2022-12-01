const leadsRoutes = require('./leadsRoutes/leads.route');
const userRoutes = require('./userRoutes/user.route');
const uninstallRoutes = require('./uninstalledRoutes/uninstall.route');
const productRoutes = require('./productRoutes/product.route');
const scrapRoutes = require('./scrapRoutes/scrap.route');
const gamingRoutes = require('./gamingRoutes/gaming.route');
const googleRoutes = require('./googleRoutes/google.routes');
//single file for routes so index isn't cluttered
module.exports = (app) =>{
  leadsRoutes(app); //leads routes
  userRoutes(app); //user routes
  uninstallRoutes(app); //uninstalled routes 
  productRoutes(app); //product routes
  scrapRoutes(app); //scrap routes
  gamingRoutes(app); //gaming routes
  googleRoutes(app); //google routes
};
