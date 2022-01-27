const debug = require('debug')('elasticsearch-articles-api-nodejs:Services->articles');
const { models: { Article, Authorship, Author, Category, ArticleCategory, Comment } } = require('../models');
const { helper: { stringToBoolean } } = require('../libs');
const ElasticsearchService = require('./elasticsearch');
const { Op } = require('sequelize');

class ArticleService {
  constructor() {
  }

  async getAll(offset = 0, limit = 10, loadRelation = false, filter = {}, showTotal = false) {
    offset = parseInt(offset) || 0;
    if (isNaN(offset) || offset < 1)
      offset = 0;
    limit = parseInt(limit) || 0;
    if (isNaN(limit) || limit < 1 || limit > 50)
      limit = 10;

    try {
      var include = null;
      if (stringToBoolean(loadRelation)) {
        include = [{
          model: Author, through: { attributes: [] },
        }, {
          model: Category, through: { attributes: [] },
        }, { model: Comment }];
      }

      const query = {
        include, where: filter
      };
      const articles = await Article.findAll({ ...query, offset, limit, order: [['title', 'asc']] });
      if (stringToBoolean(showTotal))
        return { data: articles, total: await Article.count(query) };
      else
        return articles;
    } catch (err) {
      debug('Error getAll', err);
      throw new Error(err);
    }
  }

  async getAllByCategory(id, offset = 0, limit = 10, title = '', loadRelation = false, showTotal = false) {
    offset = parseInt(offset) || 0;
    if (isNaN(offset) || offset < 1)
      offset = 0;
    limit = parseInt(limit) || 0;
    if (isNaN(limit) || limit < 1 || limit > 50)
      limit = 10;

    try {
      var include = null;
      if (stringToBoolean(loadRelation)) {
        include = [{
          model: Author,
          through: { attributes: [] }
        }, {
          model: Category, attributes: [], where: { id }
        }];
      } else {
        include = [{
          model: ArticleCategory,
          as: 'articles_categories',
          where: { category_id: id },
          attributes: [],
        }];
      }
      /*
      if (stringToBoolean(loadRelation)) {
        include = [{
          model: Authorship,
          as: 'authorships',
          include: {
            model: Author,
            as: 'author'
          }
        }, {
          model: Category, attributes: [], where: { id }
        }];
      } else {
        include = [{
          model: ArticleCategory,
          as: 'articles_categories',
          where: { category_id: id }
        }];
      }
      */

      var where = null;
      if (title)
        where = { title: { [Op.substring]: title } };
      const query = {
        include, where
      };
      const articles = await Article.findAll({ ...query, offset, limit, order: [['title', 'asc']] });
      if (stringToBoolean(showTotal))
        return { data: articles, total: await Article.count(query) };
      else
        return articles;
    } catch (err) {
      debug('Error getAllByCategory', err);
      throw new Error(err);
    }
  }

  async getAllByAuthor(id, offset = 0, limit = 10, title = '', loadRelation = false, showTotal = false) {
    offset = parseInt(offset) || 0;
    if (isNaN(offset) || offset < 1)
      offset = 0;
    limit = parseInt(limit) || 0;
    if (isNaN(limit) || limit < 1 || limit > 50)
      limit = 10;

    try {
      var include = null;
      if (stringToBoolean(loadRelation)) {
        include = [{
          model: Category,
          through: { attributes: [] }
        }, {
          model: Author, attributes: [], where: { id }
        }];
      } else {
        include = [{
          model: Authorship,
          as: 'authorships',
          attributes: [],
          where: { author_id: id },
        }];
      }
      var where = null;
      if (title)
        where = { title: { [Op.substring]: title } };
      const query = {
        include, where
      };
      const articles = await Article.findAll({ ...query, offset, limit, order: [['title', 'asc']] });
      if (stringToBoolean(showTotal))
        return { data: articles, total: await Article.count(query) };
      else
        return articles;
    } catch (err) {
      debug('Error getAllByAuthor', err);
      throw new Error(err);
    }
  }

  async getById(id, loadRelation = false) {
    if (!id) {
      debug('Please provide id.');
      return;
    }

    var include = [
      { as: 'authorships', model: Authorship, attributes: ['author_id'] },
      { as: "articles_categories", model: ArticleCategory, attributes: ['category_id'] },
    ];

    const is_load = stringToBoolean(loadRelation);
    if (is_load) {
      include = [{
        model: Author, through: { attributes: [] },
      }, {
        model: Category, through: { attributes: [] },
      }, { as: "comments", model: Comment }];
    }

    try {
      var record = await Article.findByPk(id, {
        include
      });

      if (record) {
        record = record.dataValues;
      }

      if (!is_load) {
        record.authors = record.authorships.map(authorship => authorship.dataValues);
        delete record.authorships;
        record.categories = record.articles_categories;
        delete record.articles_categories;
      }

      return record;
    } catch (err) {
      debug('Error getById', err);
      throw new Error(err);
    }
  }

  async getByField(fieldName, fieldValue) {
    if (!fieldName) {
      debug('Please provide field name.');
      return;
    }

    if (!fieldValue) {
      debug('Please provide field value.');
      return;
    }

    var where = {};
    where[fieldName] = fieldValue;
    try {
      return await Article.findOne({ where });
    } catch (err) {
      debug(`Error getByField: ${fieldName}`, err);
      throw new Error(err);
    }
  }

  async create(fields) {
    if (!fields) {
      debug('Article object is empty.');
      return;
    } else if (typeof fields === 'object' && Object.keys(fields).length === 0) {
      debug('Nothing to create.');
      return;
    } else if (!fields.title) {
      debug('Title is blank!');
      return;
    }

    var { categories = [], authors = [] } = fields;
    if (categories.length > 0) {
      categories = categories.map(c => {
        if (typeof c === 'object') return c['category_id'] || c['id'];
        else return c;
      }).filter(c => c);
    }
    if (authors.length > 0) {
      authors = authors.map(a => {
        if (typeof a === 'object') return a['author_id'] || a['id'];
        else return a;
      }).filter(a => a);
    }
    delete fields.categories;
    delete fields.authors;

    try {
      var article = await Article.create(fields);
      if (article) {
        await article.setCategories(categories);
        await article.setAuthors(authors);

        await ElasticsearchService.indexDocument(article.id, await article.as_indexed_json());
      }

      return article;
    } catch (err) {
      debug('Error create', err);
      if ((err.name === 'SequelizeValidationError') && err.errors) {
        var msg = err.errors.map(error => { return error.message }).join('\n');
        // debug('Validation: ', msg);
        throw new Error(msg);
      } else
        throw new Error(err.message);
    }
  }

  async delete(id) {
    if (!id) {
      debug('Article id is empty.');
      return;
    }

    try {
      await ArticleCategory.destroy({ where: { article_id: id } });
      await Authorship.destroy({ where: { article_id: id } });
      await Comment.destroy({ where: { article_id: id } });
      await Article.destroy({ where: { id } });
      await ElasticsearchService.removeIndexDocument(id);
    } catch (err) {
      debug('Error delete', err);
      throw new Error(err.message);
    }
  }

  async update(id, fields) {
    if (!id) {
      debug('Article id is empty.');
      return;
    }

    if (!fields) {
      debug('Nothing changed.');
      return;
    } else if (typeof fields === 'object' && Object.keys(fields).length === 0) {
      debug('Nothing changed.');
      return;
    } else if (!fields.title) {
      debug('Title is blank!');
      return;
    }

    var record = await Article.findByPk(id);
    if (!record) {
      debug(`Article with id: [${id}] does not exists.`);
      return;
    }

    var { categories = [], authors = [] } = fields;
    if (categories.length > 0) {
      categories = categories.map(c => {
        if (typeof c === 'object') return c['category_id'] || c['id'];
        else return c;
      }).filter(c => c);
    }
    if (authors.length > 0) {
      authors = authors.map(a => {
        if (typeof a === 'object') return a['author_id'] || a['id'];
        else return a;
      }).filter(a => a);
    }
    delete fields.categories;
    delete fields.authors;

    try {
      record = await record.update(fields);
      if (record != null) {
        await record.setCategories(categories);
        await record.setAuthors(authors);
        await ElasticsearchService.indexDocument(record.id, await record.as_indexed_json());
      }

      return record;
    } catch (err) {
      debug('Error update', err);
      if (Array.isArray(err.errors) && err.errors.length > 0) {
        var msgs = err.errors.map(error => {
          return error.message;
        });
        throw new Error(msgs.join('\n'));

      } else
        throw new Error(err.message);
    }
  }

}

module.exports = new ArticleService();
