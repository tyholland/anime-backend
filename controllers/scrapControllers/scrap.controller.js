const Crawler = require('crawler');
const couponService = require('./utils/getCoupons');
const scrapPage = require('./utils/productPage');
const scrapPrice = require('./utils/priceChange');

module.exports.coupon = (req, res, next) => {
  const groupon = `https://www.groupon.com/browse/boston?query=${req.params.site}`;

  const couponScraper = new Crawler({
    maxConnections: 10,
    callback: (err, response, done) => {
      if (err) {
        return next(err);
      } else {
        const $ = response.$;
        couponService.fetchItems($, res, next, req.params.site);
      }
      done();
    },
  });

  couponScraper.queue(groupon);
};

module.exports.productPage = (req, res, next) => {
  const scraper = new Crawler({
    maxConnections: 10,
    strictSSL: false,
    callback: (err, response) => {
      if (err) {
        return next(err);
      } else {
        const $ = response.$;
        let product;
        const date = new Date();

        scrapPage.allowedStores.forEach((item) => {
          if (item === 'ikea.com' && req.body.url.includes(item)) {
            product = scrapPage.ikeaProduct($);
          }
          if (item === 'sephora.com' && req.body.url.includes(item)) {
            product = scrapPage.sephoraProduct($);
          }
          if (item === 'cvs.com' && req.body.url.includes(item)) {
            product = scrapPage.cvsProduct($);
          }
          if (item === 'instacart.com' && req.body.url.includes(item)) {
            product = scrapPage.instacartProduct($);
          }
          if (item === 'ulta.com' && req.body.url.includes(item)) {
            product = scrapPage.ultaProduct($);
          }
          if (item === 'amazon.com' && req.body.url.includes(item)) {
            product = scrapPage.amazonProduct($);
          }
          if (item === 'chewy.com' && req.body.url.includes(item)) {
            product = scrapPage.chewyProduct($);
          }
          if (item === 'walmart.com' && req.body.url.includes(item)) {
            product = scrapPage.walmartProduct($);
          }
          if (item === 'hsn.com' && req.body.url.includes(item)) {
            product = scrapPage.hsnProduct($);
          }
          if (item === 'macys.com' && req.body.url.includes(item)) {
            product = scrapPage.macysProduct($);
          }
          if (item === 'nike.com' && req.body.url.includes(item)) {
            product = scrapPage.nikeProduct($);
          }
          if (item === 'overstock.com' && req.body.url.includes(item)) {
            product = scrapPage.overstockProduct($);
          }
          if (item === 'bestbuy.com' && req.body.url.includes(item)) {
            product = scrapPage.bestbuyProduct($);
          }
          if (item === 'ebay.com' && req.body.url.includes(item)) {
            product = scrapPage.ebayProduct($);
          }
          if (item === 'etsy.com' && req.body.url.includes(item)) {
            product = scrapPage.etsyProduct($);
          }
          if (item === 'anthropologie.com' && req.body.url.includes(item)) {
            product = scrapPage.anthropologieProduct($);
          }
          if (item === 'ashleyfurniture.com' && req.body.url.includes(item)) {
            product = scrapPage.ashleyfurnitureProduct($);
          }
          if (item === 'costco.com' && req.body.url.includes(item)) {
            product = scrapPage.costcoProduct($);
          }
          if (item === 'samsclub.com' && req.body.url.includes(item)) {
            product = scrapPage.samsclubProduct($);
          }
          if (item === 'staples.com' && req.body.url.includes(item)) {
            product = scrapPage.staplesProduct($);
          }
          if (item === 'officedepot.com' && req.body.url.includes(item)) {
            product = scrapPage.officedepotProduct($);
          }
        });

        if (!product.price) {
          product.price = '';
        }

        if (!product.sale) {
          product.sale = '';
        }

        if (!product.price2) {
          product.price2 = '';
        }

        if (!product.price3) {
          product.price3 = '';
        }

        product.url = req.body.url;
        product.dayAmount = 7;
        product.desired = 0;
        product.percentage = null;
        product.wishDate = `${
          date.getMonth() + 1
        }-${date.getDate()}-${date.getFullYear()}`;

        res.status(200).send(product);
        return next();
      }
    },
  });

  scraper.queue({
    uri: req.body.url,
    proxy: 'http://dfbfd2e7bf014113891588dbdaa41130:@proxy.crawlera.com:8010',
  });
};

module.exports.priceChange = (req, res, next) => {
  const product = req.body;

  const dropScraper = new Crawler({
    maxConnections: 10,
    strictSSL: false,
    callback: (err, response) => {
      if (err) {
        return next(err);
      } else {
        const $ = response.$;
        let message = {};

        scrapPage.allowedStores.forEach((item) => {
          if (item === 'ikea.com' && response.req.host.includes(item)) {
            const results = scrapPage.ikeaProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'sephora.com' && response.req.host.includes(item)) {
            const results = scrapPage.sephoraProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'cvs.com' && response.req.host.includes(item)) {
            const results = scrapPage.cvsProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'instacart.com' && response.req.host.includes(item)) {
            const results = scrapPage.instacartProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'ulta.com' && response.req.host.includes(item)) {
            const results = scrapPage.ultaProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'amazon.com' && response.req.host.includes(item)) {
            const results = scrapPage.amazonProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'chewy.com' && response.req.host.includes(item)) {
            const results = scrapPage.chewyProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'walmart.com' && response.req.host.includes(item)) {
            const results = scrapPage.walmartProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'hsn.com' && response.req.host.includes(item)) {
            const results = scrapPage.hsnProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'macys.com' && response.req.host.includes(item)) {
            const results = scrapPage.macysProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'nike.com' && response.req.host.includes(item)) {
            const results = scrapPage.nikeProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'overstock.com' && response.req.host.includes(item)) {
            const results = scrapPage.overstockProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'bestbuy.com' && response.req.host.includes(item)) {
            const results = scrapPage.bestbuyProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'ebay.com' && response.req.host.includes(item)) {
            const results = scrapPage.ebayProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'etsy.com' && response.req.host.includes(item)) {
            const results = scrapPage.etsyProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (
            item === 'anthropologie.com' &&
            response.req.host.includes(item)
          ) {
            const results = scrapPage.anthropologieProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (
            item === 'ashleyfurniture.com' &&
            response.req.host.includes(item)
          ) {
            const results = scrapPage.ashleyfurnitureProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'costco.com' && response.req.host.includes(item)) {
            const results = scrapPage.costcoProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'samsclub.com' && response.req.host.includes(item)) {
            const results = scrapPage.samsclubProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'staples.com' && response.req.host.includes(item)) {
            const results = scrapPage.staplesProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
          if (item === 'officedepot.com' && response.req.host.includes(item)) {
            const results = scrapPage.officedepotProduct($);
            message = scrapPrice.checkForDrop(product, results);
          }
        });

        res.status(200).send(message);
        return next();
      }
    },
  });

  dropScraper.queue({
    uri: product.url,
    proxy: 'http://dfbfd2e7bf014113891588dbdaa41130:@proxy.crawlera.com:8010',
  });
};
