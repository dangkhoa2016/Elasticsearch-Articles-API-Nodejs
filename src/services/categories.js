const debug = require('debug')('elasticsearch-articles-api-nodejs:Services->categories');
const { models: { Category, ArticleCategory } } = require('../models');
const { helper: { stringToBoolean } } = require('../libs');
const ElasticsearchService = require('./elasticsearch');
const Promise = require('bluebird');

class CategoryService {
  constructor() {
  }

  async getAll(offset = 0, limit = 10, filter = {}, showTotal = false) {
    offset = parseInt(offset) || 0;
    if (isNaN(offset) || offset < 1)
      offset = 0;
    limit = parseInt(limit) || 0;
    if (isNaN(limit) || limit < 1 || limit > 50)
      limit = 10;

    try {
      const query = {
        where: filter
      };
      const categories = await Category.findAll({ ...query, offset, limit, order: [['title', 'asc']] });
      if (stringToBoolean(showTotal))
        return { data: categories, total: await Category.count(query) };
      else
        return categories;
    } catch (err) {
      debug('Error getAll', err);
      throw new Error(err);
    }
  }

  async getById(id) {
    if (!id) {
      debug('Please provide id.');
      return;
    }

    try {
      return await Category.findByPk(id);
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
      return await Category.findOne({ where });
    } catch (err) {
      debug(`Error getByField: ${fieldName}`, err);
      throw new Error(err);
    }
  }

  async create(fields) {
    if (!fields) {
      debug('Category object is empty.');
      return;
    } else if (typeof fields === 'object' && Object.keys(fields).length === 0) {
      debug('Nothing to create.');
      return;
    } else if (!fields.title) {
      debug('Title is blank!');
      return;
    }

    try {
      return await Category.create(fields);
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
      debug('Category id is empty.');
      return;
    }

    var record = await Category.findByPk(id);
    if (!record) {
      debug(`Category with id: [${id}] does not exists.`);
      return;
    }

    try {
      var articles = await record.getArticles();
      await ArticleCategory.destroy({ where: { category_id: id } });
      record = await record.destroy();
      if (record != null) {
        if (articles.length > 0) {
          articles = await Promise.map(articles, async article => await article.as_indexed_json());
          await ElasticsearchService.bulkIndexDocument(articles);
        }
      }
      return record;
    } catch (err) {
      debug('Error delete', err);
      throw new Error(err.message);
    }
  }

  async update(id, fields) {
    if (!id) {
      debug('Category id is empty.');
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

    var record = await Category.findByPk(id);
    if (!record) {
      debug(`Category with id: [${id}] does not exists.`);
      return;
    }

    try {
      record = await record.update(fields);
      if (record != null) {
        var articles = await record.getArticles();
        if (articles.length > 0) {
          articles = await Promise.map(articles, async article => await article.as_indexed_json());
          await ElasticsearchService.bulkIndexDocument(articles);
        }
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

module.exports = new CategoryService();
