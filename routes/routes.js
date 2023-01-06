const leagueRoutes = require('./leagueRoutes/league.route');
const teamRoutes = require('./teamRoutes/team.route');
const userRoutes = require('./userRoutes/user.route');
const playerRoutes = require('./playerRoutes/player.route');
const matchupRoutes = require('./matchupRoutes/matchup.route');

module.exports = (app) => {
  userRoutes(app);
  playerRoutes(app);
  leagueRoutes(app);
  teamRoutes(app);
  matchupRoutes(app);
};
