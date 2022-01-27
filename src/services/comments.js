const debug = require('debug')('elasticsearch-articles-api-nodejs:Services->comments');
const { models: { Comment, Article } } = require('../models');
const { helper: { stringToBoolean } } = require('../libs');

class CommentService {
  constructor() {
  }

  async getAll(offset=0, limit = 10, loadRelation = false, filter = {}, showTotal = false) {
    offset = parseInt(offset) || 0;
    if (isNaN(offset) || offset < 1)
      offset = 0;
    limit = parseInt(limit) || 0;
    if (isNaN(limit) || limit < 1 || limit > 50)
      limit = 10;

    try {
      var include = null;
      var exclude = null;
      if (stringToBoolean(loadRelation)) {
        include = [
          { model: Article, as: 'article' },
        ];
        exclude = ['article_id'];
      }

      const query = {
        include, where: filter, attributes: { exclude },
      };
      const comments = await Comment.findAll({ ...query, offset, limit, order: [['created_at', 'desc']] });
      if (stringToBoolean(showTotal))
        return { data: comments, total: await Comment.count(query) };
      else
        return comments;
    } catch (err) {
      debug('Error getAll', err);
      throw new Error(err);
    }
  }

  async getAllByArticle(id, offset = 0, limit = 10, showTotal = false) {
    offset = parseInt(offset) || 0;
    if (isNaN(offset) || offset < 1)
      offset = 0;
    limit = parseInt(limit) || 0;
    if (isNaN(limit) || limit < 1 || limit > 50)
      limit = 10;

    try {
      const query = {
        where: { article_id: id },
      };
      const comments = await Comment.findAll({ ...query, offset, limit, order: [['created_at', 'desc']] });
      if (stringToBoolean(showTotal))
        return { data: comments, total: await Comment.count(query) };
      else
        return comments;
    } catch (err) {
      debug('Error getAllByArticle', err);
      throw new Error(err);
    }
  }

  async getById(id, loadRelation = false) {
    if (!id) {
      debug('Please provide id.');
      return;
    }

    try {
      var include = null;
      var exclude = null;
      if (stringToBoolean(loadRelation)) {
        include = [
          { model: Article, as: 'article' },
        ];
        exclude = ['article_id'];
      }

      return await Comment.findByPk(id, { include, attributes: { exclude } });
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
      return await Comment.findOne({ where });
    } catch (err) {
      debug(`Error getByField: ${fieldName}`, err);
      throw new Error(err);
    }
  }

  async create(fields) {
    if (!fields) {
      debug('Comment object is empty.');
      return;
    } else if (typeof fields === 'object' && Object.keys(fields).length === 0) {
      debug('Nothing to create.');
      return;
    }

    try {
      return await Comment.create(fields);
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
      debug('Comment id is empty.');
      return;
    }

    try {
      await Comment.destroy({ where: { id } });
    } catch (err) {
      debug('Error delete', err);
      throw new Error(err.message);
    }
  }

  async update(id, fields) {
    if (!id) {
      debug('Comment id is empty.');
      return;
    }

    if (!fields) {
      debug('Nothing changed.');
      return;
    } else if (typeof fields === 'object' && Object.keys(fields).length === 0) {
      debug('Nothing changed.');
      return;
    }

    const record = await Comment.findByPk(id);
    if (!record) {
      debug(`Comment with id: [${id}] does not exists.`);
      return;
    }

    try {
      return await record.update(fields);
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

module.exports = new CommentService();
