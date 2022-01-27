const { models } = require('../models');

(async () => {

  var test = await models.Authorship.findOne({
    include: [{
      model: models.Article,
      as: "article",
      include: models.Category
    }, {
      model: models.Author,
      as: "author",
    }]
  });
  var { article, author } = test;
  var { title, abstract, categories } = article;
  console.log(title, abstract, author, categories);
  console.log(categories[0].title, author.first_name);

})();
