const { expressjwt } = require('express-jwt');
const { getAuthToken } = require('.');
const secret = process.env.REACT_APP_SECRET;

module.exports.middleware = () => {
  return expressjwt({
    secret,
    algorithms: ['HS256'],
    getToken: function getTokenFromAuth(req) {
      const token =
        req.cookies.token || getAuthToken(req.headers.authorization);

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
      '/users/logout',
      '/league/view',
      '/player',
      /^\/player\/.*/,

      '/',
      '/error',
      '/doc',
    ],
  });
};
