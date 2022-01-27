
const { models: { Article } } = require('../models');

(async () => {

  const data = await Article.findOne({ where: { id: 30 }, raw: true, attributes: { exclude: ['id'] } });

  data.name = data.name + '(copy)';
  const newRecord = await Article.create(data);
  console.log(newRecord);

})();
