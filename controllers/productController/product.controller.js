const { stripe } = require('../../config');
const stripeConnect = require('stripe')(stripe);

//Get extra products !!! REQUIRES PRICE ID !!!
const getExtraProd = async (products, res) => {
  stripeConnect.prices
    .list({
      limit: 100,
      starting_after: products[products.length - 1].id,
      expand: ['data.product'] //this makes it to where price returns the product it's attached to
    })
  // returns and array of objects.
  // price is the parent object
  // product is nested in price. (object.product)
    .then((extraProducts) => {
      const arr = products;
      const newArr = arr.concat(extraProducts.data);

      if (extraProducts.has_more) {
        getExtraProd(newArr, res);
      } else {
        res.status(200).json(newArr);
      }
    })
    .catch((err) => res.status(500).json(err));
};

//Get all Products
module.exports.getProducts = (req, res) => {
  stripeConnect.prices
    .list({
      limit: 100,
      active: true,
      expand: ['data.product'] //this makes it to where price returns the product it's attached to
    })
  // returns and array of objects.
  // price is the parent object
  // product is nested in price. (object.product)
    .then((products) => {
      if (products.has_more) {
        getExtraProd(products.data, res);
      } else {
        res.status(200).json(products);
      }
    })
    .catch((err) => res.status(500).json(err));
};

//Get extra products !!! REQUIRES PRICE ID !!!
module.exports.getExtraProduct = (req, res) => {
  stripeConnect.prices
    .list({
      limit: 100,
      starting_after: req.body.priceId,
      expand: ['data.product'] //this makes it to where price returns the product it's attached to
    })
  // returns and array of objects.
  // price is the parent object
  // product is nested in price. (object.product)
    .then((extraProducts) => res.status(200).json(extraProducts))
    .catch((err) => res.status(500).json(err));
};

//Get one Product !!! REQUIRES PRICE ID !!!
module.exports.getProductById = (req, res) => {
  console.log(req.params.id);
  stripeConnect.prices
    .retrieve(`${req.params.id}`, {
      expand: ['product']
    })
  // returns single price object
  // product object is nested inside. (object.product)
    .then((product) => res.status(200).json(product))
    .catch((err) => res.status(500).json(err));
};
