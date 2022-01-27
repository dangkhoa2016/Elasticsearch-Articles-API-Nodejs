const { models, sequelize } = require('../models');
const Sequelize = require('sequelize');
(async () => {

  // var test = await models.Author.findAll({ limit: 1 });
  // console.log(test);


  // var keyword ='an`"\'';
  var keyword =`an`;

  test = await sequelize.query(`SELECT * FROM authors
  WHERE (first_name  || ' ' || last_name) LIKE '%${keyword}%'
  LIMIT :page * :size, :size`, {
    replacements: {
      page: 0,
      size: 3
    },
    type: 'SELECT',
    model: models.Author,
    mapToModel: true,
  });
  console.log(test.length);

  var test = await models.Author.findAll({
    where: {
      [Sequelize.Op.and]: [
        sequelize.literal(`first_name || ' ' || last_name like "%${keyword}%"`)
      ]
    },
    limit: 1, skip: 0
  });
  console.log(test.length);

  var test = await models.Author.findAll({
    where: sequelize.literal(`first_name || ' ' || last_name like ?`),
    limit: 1, offset: 3,
    replacements: [`%${keyword}%`],
  });
  console.log(test.length);

  test = await models.Author.count({
    where: sequelize.literal(`first_name || ' ' || last_name like ?`),
    limit: 1, offset: 3,
    replacements: [`%${keyword}%`],
  });
  console.log(test);

})();
