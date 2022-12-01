module.exports.checkExpDate = (date) => {
  if (date) {
    date = date.split('+')[0];
  }

  const d1 = new Date().getTime();
  const d2 = new Date(date);

  const diff = d2.getTime() - d1;

  if (diff < 1) {
    return 'Expired';
  } else {
    return 'New';
  }
};

module.exports.removeBadCoupons = (codes) => {
  if (!codes) {
    return [];
  }

  const arr = [];

  codes.forEach((item) => {
    if (this.checkExpDate(item.endDate) !== 'Expired') {
      arr.push(item);
    }
  });

  return arr;
};
