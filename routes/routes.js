const leadsRoutes = require('./leadsRoutes/leads.route');
const uninstallRoutes = require('./uninstalledRoutes/uninstall.route');
const productRoutes = require('./productRoutes/product.route');
const scrapRoutes = require('./scrapRoutes/scrap.route');
const gamingRoutes = require('./gamingRoutes/gaming.route');
const googleRoutes = require('./googleRoutes/google.routes');

const userRoutes = require('./userRoutes/user.route');
const characterRoutes = require('./characterRoutes/character.route');

module.exports = (app) => {
  userRoutes(app);
  characterRoutes(app);
  leadsRoutes(app);
  uninstallRoutes(app);
  productRoutes(app);
  scrapRoutes(app);
  gamingRoutes(app);
  googleRoutes(app);
};
