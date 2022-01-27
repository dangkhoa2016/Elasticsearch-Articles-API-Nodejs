const { CommentService } = require('../../services');
const debug = require('debug')('elasticsearch-articles-api-nodejs:Routes->comments.handlers');

const getHandler = async (req, res) => {
  var { skip = 0, take = 10, loadRelation = false, showTotal = false } = req.query;

  try {
    res.json(await CommentService.getAll(skip, take, loadRelation, null, showTotal));
  } catch (err) {
    debug('Error getHandler', err);
    throw new Error(err);
  }
};

const getOneHandler = async (req, res) => {
  const { id } = req.params;
  var { loadRelation = false } = req.query;

  try {
    res.json(await CommentService.getById(id, loadRelation));
  } catch (err) {
    debug('Error getOneHandler', err);
    throw new Error(err);
  }
};

const postHandler = async (req, res) => {
  const { article_id, body, user, user_location, stars, pick } = req.body;

  try {
    res.json(await CommentService.create({ article_id, body, user, user_location, stars, pick }));
  } catch (err) {
    debug('Error postHandler', err);
    throw new Error(err);
  }
};

const update = async function (req, res, next) {
  const { id } = req.params;
  const { article_id, body, user, user_location, stars, pick } = req.body;

  try {
    res.json(await CommentService.update(id, { article_id, body, user, user_location, stars, pick }));
  } catch (err) {
    debug('Error update', err);
    next(err);
  }
};

const putOneHandler = async (req, res) => {
  return await update(req, res);
};

const patchOneHandler = async (req, res) => {
  return await update(req, res);
};

const deleteOneHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await CommentService.delete(id);
    res.json({ msg: `Comment with id: [${id}] has been deleted.` });
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
}