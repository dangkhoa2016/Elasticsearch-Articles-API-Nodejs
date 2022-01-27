const { sequelize } = require('../models');

(async () => {

  // await list_columns();
  // await list_rows();
  await list_tables();
  // await clear_rows();

})();

async function list_tables() {
  const [results, metadata] = await sequelize.query(`SELECT name FROM sqlite_master WHERE type = "table";`);
  console.log(results, metadata);
};

async function list_columns() {
  const [results, metadata] = await sequelize.query("PRAGMA table_info('SequelizeMeta');");
  console.log(results, metadata);
};

async function list_rows() {
  const [results, metadata] = await sequelize.query("select * from 'SequelizeMeta';");
  console.log(results, metadata);
};

async function clear_rows() {
  const [results, metadata] = await sequelize.query("delete from 'SequelizeMeta';");
  console.log(results, metadata);
};
