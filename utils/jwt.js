const { expressjwt } = require('express-jwt');
const { getAuthToken } = require('.');
const secret = process.env.SECRET;

module.exports.middleware = () => {
  return expressjwt({
    secret,
    algorithms: ['HS256'],
    getToken: function getTokenFromAuth(req) {
      const token = getAuthToken(req.headers.authorization);

      if (!token) {
        return null;
      }

      return token;
    },
  }).unless({
    path: [
      // public routes that don't require authentication
      '/users/create',
      '/users/login',
      '/users/exists',
      '/users/logout',
      '/matchup/all/votes',
      '/player',
      '/player/anime/news',
      '/bracket/add',
      '/matchup/add',
      '/cron/affinity',
      '/cron/start',
      '/cron/vote',
      '/cron/schedule',
      '/cron/round1',
      /^\/admin\/player\/formula\/.*/,
      /^\/player\/.*/,
      /^\/bracket\/.*/,
      /^\/bracket\/champ\/.*/,
      /^\/matchup\/votes\/.*/,

      '/',
      '/error',
      '/doc',
    ],
  });
};
