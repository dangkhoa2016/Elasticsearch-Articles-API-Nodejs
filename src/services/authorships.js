const debug = require('debug')('elasticsearch-articles-api-nodejs:Services->authorships');
const { models: { Authorship, Article, Author } } = require('../models');
const { helper: { stringToBoolean } } = require('../libs');

class AuthorshipService {
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
      var exclude = null;
      if (stringToBoolean(loadRelation)) {
        include = [
          { model: Author, as: 'author' },
          { model: Article, as: 'article' },
        ];
        exclude = ['article_id', 'author_id'];
      }

      const query = {
        include, where: filter, attributes: { exclude },
      };
      const authorships = await Authorship.findAll({ ...query, offset, limit, order: [['article_id', 'asc']] });
      if (stringToBoolean(showTotal))
        return { data: authorships, total: await Authorship.count(query) };
      else
        return authorships;
    } catch (err) {
      debug('Error getAll', err);
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
      if (stringToBoolean(loadRelation)) {
        include = [Author, Article];
      }

      return await Authorship.findByPk(id, { include });
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
      return await Authorship.findOne({ where });
    } catch (err) {
      debug(`Error getByField: ${fieldName}`, err);
      throw new Error(err);
    }
  }

  async create(fields) {
    if (!fields) {
      debug('Authorship object is empty.');
      return;
    } else if (typeof fields === 'object' && Object.keys(fields).length === 0) {
      debug('Nothing to create.');
      return;
    }

    try {
      return await Authorship.create(fields);
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
      debug('Authorship id is empty.');
      return;
    }

    try {
      await Authorship.destroy({ where: { id } });
    } catch (err) {
      debug('Error delete', err);
      throw new Error(err.message);
    }
  }

  async update(id, fields) {
    if (!id) {
      debug('Authorship id is empty.');
      return;
    }

    if (!fields) {
      debug('Nothing changed.');
      return;
    } else if (typeof fields === 'object' && Object.keys(fields).length === 0) {
      debug('Nothing changed.');
      return;
    }

    const record = await Authorship.findByPk(id);
    if (!record) {
      debug(`Authorship with id: [${id}] does not exists.`);
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

module.exports = new AuthorshipService();
