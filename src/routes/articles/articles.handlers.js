const { ArticleService, CommentService } = require('../../services');
const debug = require('debug')('elasticsearch-articles-api-nodejs:Routes->articles.handlers');
const { Op } = require('sequelize');

const getHandler = async (req, res) => {
  var { skip = 0, take = 10, title = '', loadRelation = false, showTotal = false } = req.query;

  try {
    var where = null;
    if (title)
      where = { title: { [Op.substring]: title } };
    res.json(await ArticleService.getAll(skip, take, loadRelation, where, showTotal));
  } catch (err) {
    debug('Error getHandler', err);
    throw new Error(err);
  }
};

const getCommentsForArticle = async (req, res) => {
  const { id } = req.params;
  var { skip = 0, take = 10, showTotal = false, } = req.query;

  try {
    res.json(await CommentService.getAllByArticle(id, skip, take, showTotal));
  } catch (err) {
    debug('Error getCommentsForArticle', err);
    throw new Error(err);
  }
};

const getOneHandler = async (req, res) => {
  const { id } = req.params;
  var { loadRelation } = req.query;

  try {
    res.json(await ArticleService.getById(id, loadRelation));
  } catch (err) {
    debug('Error getOneHandler', err);
    throw new Error(err);
  }
};

const postHandler = async (req, res) => {
  const { title = '', content, abstract, shares = 0, authors = [], categories = [], published_on } = req.body;

  try {
    res.json(await ArticleService.create({ title, content, abstract, shares, authors, categories, published_on }));
  } catch (err) {
    debug('Error postHandler', err);
    throw new Error(err);
  }
};

const update = async function (req, res) {
  const { id } = req.params;
  const { title = '', content, abstract, shares = 0, authors = [], categories = [], published_on } = req.body;

  try {
    res.json(await ArticleService.update(id, { title, content, abstract, shares, authors, categories, published_on }));
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
    await ArticleService.delete(id);
    res.json({ msg: `Article with id: [${id}] has been deleted.` });
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
  getCommentsForArticle,
}