
const ArticleService = require('./articles');
const CategoryService = require('./categories');
const AuthorService = require('./authors');
const AuthorshipService = require('./authorships');
const CommentService = require('./comments');
const ElasticsearchService = require('./elasticsearch');

module.exports = {
  ArticleService,
  CategoryService,
  AuthorService,
  CommentService,
  AuthorshipService,
  ElasticsearchService
};
