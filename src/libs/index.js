
const helper = require('./helper');

const caches = require('./caches');
const { client, indexName } = require('./elasticsearch');

module.exports = {
  helper, caches, elasticsearch: { client, indexName }
};
