const { models } = require('../models');

(async () => {

  var test = await models.Article.findOne({
    include: [{
      model: models.Authorship,
      as: 'authorships',
      include: {
        model: models.Author,
        as: 'author'
      }
    }, { model: models.Category, where: { id: 2 } }],
    where: { id: 2 }
  });
  console.log(test)
  var { title, abstract, categories, authorships } = test;
  console.log(title, abstract);
  console.log(categories[0].title, authorships[0].author.first_name);

})();
