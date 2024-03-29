const NodeCache = require("node-cache");
const myCache = new NodeCache({ stdTTL: 0, checkperiod: 0 });

const setCache = function(key, value) {
  return myCache.set(key, value);
}

const deleteCache = function(key) {
  return myCache.del(key);
}

const getCache = function(key) {
  return myCache.get(key);
}

const hasCache = function(key) {
  return myCache.has(key);
}

module.exports = {
  setCache,
  hasCache,
  deleteCache,
  getCache,
};
