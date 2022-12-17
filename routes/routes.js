const leagueRoutes = require('./leagueRoutes/league.route');
const uninstallRoutes = require('./uninstalledRoutes/uninstall.route');
const productRoutes = require('./productRoutes/product.route');
const scrapRoutes = require('./scrapRoutes/scrap.route');
const teamRoutes = require('./teamRoutes/team.route');
const googleRoutes = require('./googleRoutes/google.routes');
const userRoutes = require('./userRoutes/user.route');
const playerRoutes = require('./playerRoutes/player.route');

module.exports = (app) => {
  userRoutes(app);
  playerRoutes(app);
  leagueRoutes(app);
  uninstallRoutes(app);
  productRoutes(app);
  scrapRoutes(app);
  teamRoutes(app);
  googleRoutes(app);
};
