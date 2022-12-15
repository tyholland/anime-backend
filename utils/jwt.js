const { expressjwt } = require('express-jwt');
const secret = process.env.REACT_APP_SECRET;

module.exports.middleware = () => {
  return expressjwt({ secret, 
    algorithms: ['HS256'],
    getToken: function getTokenFromCookie(req){
      if(!req.cookies.token){
        return null;
      }
      return req.cookies.token;
    }
  }).unless({
    path: [
      // public routes that don't require authentication
      '/', // api homepage
      '/leads/create', // creates one lead
      '/uninstalled/create', // creates an uninstalled user.
      '/scrap/product', // gets product page details.
      '/scrap/price', // gets product price change
      /^\/scrap\/coupon\/.*/, // gets coupons for specific site.
      '/users/create', // creates one user.
      '/users/account',
      '/player',
      '/products', // gets all products
      /^\/products\/extra\/.*/, // gets extra products by last product id
      /^\/products\/.*/, // gets single product by id
      '/auth/google', // main google login endpoint
      '/auth/google/callback', // google callback
      '/error', // google error
      '/doc' // api documentation
    ],
  });
};
