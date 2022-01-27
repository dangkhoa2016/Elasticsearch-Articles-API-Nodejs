const express = require('express')
const router = express.Router();

router.use('/articles', require('./articles'));
router.use('/categories', require('./categories'));
router.use('/comments', require('./comments'));
router.use('/authorships', require('./authorships'));
router.use('/authors', require('./authors'));

module.exports = router;
