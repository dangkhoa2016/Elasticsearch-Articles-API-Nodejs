const express = require('express');
const router = express.Router();
const { getHandler, getOneHandler, postHandler, putOneHandler,
  patchOneHandler, deleteOneHandler,
  getArticlesForAuthor } = require("./authors.handlers");

router.route("/").get(getHandler).post(postHandler);
router.route("/:id").get(getOneHandler).put(putOneHandler).patch(patchOneHandler).delete(deleteOneHandler);
router.get('/:id/articles', getArticlesForAuthor);
router.get('/:id/delete', deleteOneHandler);

module.exports = router;