const { expressjwt } = require('express-jwt');
const secret = process.env.REACT_APP_SECRET;

module.exports.middleware = () => {
  return expressjwt({
    secret,
    algorithms: ['HS256'],
    getToken: function getTokenFromCookie(req) {
      if (!req.cookies.token) {
        return null;
      }
      return req.cookies.token;
    },
  }).unless({
    path: [
      // public routes that don't require authentication
      '/users/create',
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
    ],
  });
};
