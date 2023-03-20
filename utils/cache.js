const apicache = require('apicache');
let cache;

const setupCache = () => {
  cache = apicache.middleware;

  return cache;
};

module.exports.instance = () => {
  if (cache) {
    return cache;
  }

  return setupCache();
};

module.exports.cacheFiveMins = 300;
module.exports.cacheThirtyMins = 1800;
module.exports.cacheOneHour = 3600;
module.exports.cacheOneDay = 86400;
module.exports.cacheOneWeek = 604800;
module.exports.cacheOneYear = '1 year';
