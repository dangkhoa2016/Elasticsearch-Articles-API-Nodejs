const { AuthorService, ArticleService } = require('../../services');
const debug = require('debug')('elasticsearch-articles-api-nodejs:Routes->authors.handlers');
const { sequelize } = require('../../models');

const getHandler = async (req, res) => {
  var { skip = 0, take = 10, name = '', showTotal = false } = req.query;

  try {
    var where, replacements = null;
    if (name) {
      where = sequelize.literal(`first_name || ' ' || last_name like ?`);
      replacements = [`%${name}%`];
    }
    res.json(await AuthorService.getAll(skip, take, where, replacements, showTotal));
  } catch (err) {
    debug('Error getHandler', err);
    throw new Error(err);
  }
};

const getArticlesForAuthor = async (req, res) => {
  const { id } = req.params;
  var { skip = 0, take = 10, title = '', loadRelation = false, showTotal = false, } = req.query;

  try {
    res.json(await ArticleService.getAllByAuthor(id, skip, take, title, loadRelation, showTotal));
  } catch (err) {
    debug('Error getArticlesForAuthor', err);
    throw new Error(err);
  }
};

const getOneHandler = async (req, res) => {
  const { id } = req.params;

  try {
    res.json(await AuthorService.getById(id));
  } catch (err) {
    debug('Error getOneHandler', err);
    throw new Error(err);
  }
};

const postHandler = async (req, res) => {
  const { first_name = '', last_name = '' } = req.body;

  try {
    res.json(await AuthorService.create({ first_name, last_name }));
  } catch (err) {
    debug('Error postHandler', err);
    throw new Error(err);
  }
};

const update = async function (req, res) {
  const { id } = req.params;
  const { first_name = '', last_name = '' } = req.body;

  try {
    res.json(await AuthorService.update(id, { first_name, last_name }));
  } catch (err) {
    debug('Error update', err);
    throw new Error(err);
  }
}

const putOneHandler = async (req, res) => {
  return await update(req, res);
};

const patchOneHandler = async (req, res) => {
  return await update(req, res);
};

const deleteOneHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await AuthorService.delete(id);
    res.json({ msg: `Author with id: [${id}] has been deleted.` });
  } catch (err) {
    debug('Error deleteOneHandler', err);
    throw new Error(err);
  }
};

module.exports = {
  getHandler,
  postHandler,

  getOneHandler,
  deleteOneHandler,
  patchOneHandler,
  putOneHandler,

  getArticlesForAuthor
}