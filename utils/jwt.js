const { expressjwt } = require('express-jwt');
const { getAuthToken } = require('.');
const secret = process.env.REACT_APP_SECRET;

module.exports.middleware = () => {
  return expressjwt({
    secret,
    algorithms: ['HS256'],
    getToken: function getTokenFromAuth(req) {
      if (!req.headers.authorization) {
        return null;
      }

      return getAuthToken(req.headers.authorization);
    },
  }).unless({
    path: [
      // public routes that don't require authentication
      '/users/create',
      '/users/login',
      '/player',
      /^\/player\/.*/,

      '/',
      '/error',
      '/doc',

      // public routes that will need authentication
      /^\/league\/.*/,
      /^\/league\/view\/.*/,
      '/league/create',
      /^\/users\/.*/,
      /^\/team\/name\/.*/,
      /^\/team\/info\/.*/,
      /^\/team\/.*\/.*/,
      /^\/team\/.*/,
      /^\/matchup\/.*/,
    ],
  });
};
