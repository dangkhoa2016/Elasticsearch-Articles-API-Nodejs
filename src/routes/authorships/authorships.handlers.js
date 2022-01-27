const { AuthorshipService } = require('../../services');
const debug = require('debug')('elasticsearch-articles-api-nodejs:Routes->authorships.handlers');

const getHandler = async (req, res) => {
  var { skip = 0, take = 10, loadRelation = false, showTotal = false } = req.query;

  try {
    res.json(await AuthorshipService.getAll(skip, take, loadRelation, null, showTotal));
  } catch (err) {
    debug('Error getHandler', err);
    throw new Error(err);
  }
};

const getOneHandler = async (req, res) => {
  const { id } = req.params;
  var { loadRelation = false } = req.query;

  try {
    res.json(await AuthorshipService.getById(id, loadRelation));
  } catch (err) {
    debug('Error getOneHandler', err);
    throw new Error(err);
  }
};

const postHandler = async (req, res) => {
  const { article_id, author_id } = req.body;

  try {
    res.json(await AuthorshipService.create({ article_id, author_id }));
  } catch (err) {
    debug('Error postHandler', err);
    throw new Error(err);
  }
};

const update = async function (req, res, next) {
  const { id } = req.params;
  const { article_id, author_id } = req.body;

  try {
    res.json(await AuthorshipService.update(id, { article_id, author_id }));
  } catch (err) {
    debug('Error update', err);
    next(err);
  }
};

const putOneHandler = async (req, res, next) => {
  return await update(req, res, next);
};

const patchOneHandler = async (req, res, next) => {
  return await update(req, res, next);
};

const deleteOneHandler = async (req, res) => {
  const { id } = req.params;

  try {
    await AuthorshipService.delete(id);
    res.json({ msg: `Authorship with id: [${id}] has been deleted.` });
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