const express = require('express');
const router = express.Router();
const { getHandler, getOneHandler, postHandler, putOneHandler,
  patchOneHandler, deleteOneHandler, getArticlesForCategory } = require("./categories.handlers");

router.route("/").get(getHandler).post(postHandler);
router.route("/:id").get(getOneHandler).put(putOneHandler).patch(patchOneHandler).delete(deleteOneHandler);
router.get('/:id/articles', getArticlesForCategory);
router.get('/:id/delete', deleteOneHandler);

module.exports = router;
