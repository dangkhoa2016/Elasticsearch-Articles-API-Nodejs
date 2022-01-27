var DataTypes = require("sequelize").DataTypes;
var _articles = require("./articles");
var _articles_categories = require("./articles_categories");
var _authors = require("./authors");
var _authorships = require("./authorships");
var _categories = require("./categories");
var _comments = require("./comments");

function initModels(sequelize) {
  var Article = _articles(sequelize, DataTypes);
  var ArticleCategory = _articles_categories(sequelize, DataTypes);
  var Author = _authors(sequelize, DataTypes);
  var Authorship = _authorships(sequelize, DataTypes);
  var Category = _categories(sequelize, DataTypes);
  var Comment = _comments(sequelize, DataTypes);

  Article.belongsToMany(Category, { through: ArticleCategory, foreignKey: "article_id" });
  Category.belongsToMany(Article, { through: ArticleCategory, foreignKey: "category_id" });
  Category.hasMany(ArticleCategory, { as: "articles_categories", foreignKey: "category_id" });
  ArticleCategory.belongsTo(Article, { as: "article", foreignKey: "article_id" });
  ArticleCategory.belongsTo(Category, { as: "category", foreignKey: "category_id" });
  Article.hasMany(ArticleCategory, { as: "articles_categories", foreignKey: "article_id" });
  
  // Article.hasMany(ArticleCategory, { foreignKey: "article_id" });
  // Category.hasMany(ArticleCategory, { foreignKey: "category_id"});
  // ArticleCategory.belongsTo(Article, { foreignKey: "article_id" });
  // ArticleCategory.belongsTo(Category, { foreignKey: "category_id"});

  Comment.belongsTo(Article, { as: "article", foreignKey: "article_id" });
  Article.hasMany(Comment, { as: "comments", foreignKey: "article_id" });

  /*
  Authorship.belongsTo(Article, { as: "article", foreignKey: "article_id" });
  Article.hasMany(Authorship, { as: "authorships", foreignKey: "article_id" });
  Authorship.belongsTo(Author, { as: "author", foreignKey: "author_id" });
  Author.hasMany(Authorship, { as: "authorships", foreignKey: "author_id" });
  */
  Article.belongsToMany(Author, { through: Authorship, foreignKey: "article_id" });
  Author.belongsToMany(Article, { through: Authorship, foreignKey: "author_id" });
  Author.hasMany(Authorship, { as: "authorships", foreignKey: "author_id" });
  Authorship.belongsTo(Author, { as: "author", foreignKey: "author_id" });
  Authorship.belongsTo(Article, { as: "article", foreignKey: "article_id" });
  Article.hasMany(Authorship, { as: "authorships", foreignKey: "article_id" });

  return {
    Article,
    ArticleCategory,
    Author,
    Authorship,
    Category,
    Comment,
  };
}

module.exports = initModels;