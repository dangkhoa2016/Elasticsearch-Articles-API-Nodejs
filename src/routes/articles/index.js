const express = require('express');
const router = express.Router();
const { getHandler, getOneHandler, postHandler, putOneHandler,
  patchOneHandler, deleteOneHandler, getCommentsForArticle } = require("./articles.handlers");

router.route("/").get(getHandler).post(postHandler);
router.route("/:id").get(getOneHandler).put(putOneHandler).patch(patchOneHandler).delete(deleteOneHandler);
router.get('/:id/delete', deleteOneHandler);
router.get('/:id/comments', getCommentsForArticle);

module.exports = router;
