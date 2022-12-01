const {getProducts, getExtraProduct, getProductById} = require('../../controllers/productController/product.controller');

module.exports = (app) => { //!!! ALL ID'S ARE PRICE NOT PRODUCT ID !!! if you give a product Id nothing will be returned.
  app.get('/products', getProducts); //gets a list of 100 products
  app.get('/products/extra/:id', getExtraProduct); // Requires PRICE Id. Returns a list of 100 products and prices starting after inputted price ID
  app.get('/products/:id', getProductById); //Requires PRICE Id. Returns a single product by price ID
};
