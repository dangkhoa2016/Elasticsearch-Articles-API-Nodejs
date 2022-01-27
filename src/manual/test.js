const { models } = require('../models');

(async () => {

  var test = await models.Article.findAll({ limit: 1 });
  console.log(test);

  test = await models.Category.findAll({ limit: 1 });
  console.log(test);

  test = await models.Author.findAll({ limit: 1 });
  console.log(test);

})();
