const {coupon, productPage, priceChange} = require('../../controllers/scrapControllers/scrap.controller');

module.exports = (app) => {
  app.get('/scrap/coupon/:site', coupon); // gets coupons for specific site.
  app.post('/scrap/product', productPage); // gets product page details.
  app.post('/scrap/price', priceChange); // gets product price change
};
