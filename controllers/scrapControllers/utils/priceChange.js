const PRICE_DROP_SERVICE = require('../../../utils/constants.js');

module.exports.checkForDrop = (product, data) => {
  const { price } = data;
  const { desired, dayAmount, wishDate, name } = product;
  const currentPrice = +price;
  const desiredPrice = +desired;
  const currentDate = new Date();
  let reminder = new Date(wishDate);
  reminder = reminder.setDate(reminder.getDate() + dayAmount);

  if (data.name === name) {
    if (currentDate <= reminder && currentPrice <= desiredPrice) {
      return {
        msg: PRICE_DROP_SERVICE,
        hasDrop: true,
        prod: name,
      };
    }

    if (currentDate > reminder) {
      return {
        msg: 'Your item hasn’t reached your desired price yet. Please update your price tracking reminder and we’ll let you know when it’s on sale!',
        hasDrop: true,
        prod: name,
      };
    }

    if (currentPrice <= desiredPrice) {
      return {
        msg: PRICE_DROP_SERVICE,
        hasDrop: true,
        prod: name,
      };
    }
  }

  return {
    hasDrop: false,
  };
};
