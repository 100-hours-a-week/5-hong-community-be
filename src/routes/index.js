const router = require('express').Router();

const healthCheckRouter = require('./healthCheckRouter');
const memberRouter = require('./memberRouter');
const postRouter = require('./postRouter');
const commentRouter = require('./commentRouter');

router.use('/ping', healthCheckRouter);
router.use('/members', memberRouter);
router.use('/posts', postRouter);
router.use('/comments', commentRouter);

module.exports = router;
