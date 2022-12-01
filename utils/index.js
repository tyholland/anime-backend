/* eslint-disable no-useless-escape */
const { secret } = require('../config');
const jwt = require('jsonwebtoken');




module.exports.formatDate = () => {
  const date = new Date();
  const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  return formattedDate;
};

module.exports.authenticateToken = (req, res, next) => { // only does email I think

  const token = req.cookies.token; //bearer token
  if (token == null) return res.status(401).json({type: 'NO AUTH TOKEN!'});
  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({type: 'BAD AUTH TOKEN'});
    req.user = user;
    next();
  });
};
