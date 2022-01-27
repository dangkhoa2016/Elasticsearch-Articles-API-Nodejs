const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const sequelize = new Sequelize(dbConfig);
var initModels = require("./init-models");
const models = initModels(sequelize);

module.exports = {
  models,
  sequelize
}
