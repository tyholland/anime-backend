const handler = require('serverless-express/handler');
const app = require('./index');

module.exports.handler = handler(app);
