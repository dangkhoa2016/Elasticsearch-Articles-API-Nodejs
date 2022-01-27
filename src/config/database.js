const path = require('path');
const DATABASE_PATH = '../database'
const DATABASE = 'development.sqlite3'
const storage = path.join(__dirname, DATABASE_PATH, DATABASE);

module.exports = {
  dialect: 'sqlite',
  storage
};
