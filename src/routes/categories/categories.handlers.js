const { CategoryService, AuthorshipService, ArticleService } = require('../../services');
const debug = require('debug')('elasticsearch-articles-api-nodejs:Routes->categories.handlers');
const { Op } = require('sequelize');

const getHandler = async (req, res) => {
  var { skip = 0, take = 10, title = '', showTotal = false } = req.query;

  try {
    var where = null;
    if (title)
      where = { title: { [Op.substring]: title } };
    res.json(await CategoryService.getAll(skip, take, where, showTotal));
  } catch (err) {
    debug('Error getHandler', err);
    throw new Error(err);
  }
};

const getArticlesForCategory = async (req, res) => {
  const { id } = req.params;
  var { skip = 0, take = 10, title = '', loadRelation = false, showTotal = false } = req.query;

  try {
    res.json(await ArticleService.getAllByCategory(id, skip, take, title, loadRelation, showTotal));
  } catch (err) {
    debug('Error getArticlesForCategory', err);
    throw new Error(err);
  }
};

const getOneHandler = async (req, res) => {
  const { id } = req.params;

  try {
    res.json(await CategoryService.getById(id));
  } catch (err) {
    debug('Error getOneHandler', err);
    throw new Error(err);
  }
};

const postHandler = async (req, res) => {
  const { title = '' } = req.body;

  try {
    res.json(await CategoryService.create({ title }));
  } catch (err) {
    debug('Error postHandler', err);
    throw new Error(err);
  }
};

const update = async function (req, res) {
  const { id } = req.params;
  const { title = '' } = req.body;

  try {
    res.json(await CategoryService.update(id, { title }));
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
    await CategoryService.delete(id);
    res.json({ msg: `Category with id: [${id}] has been deleted.` });
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

  getArticlesForCategory
}