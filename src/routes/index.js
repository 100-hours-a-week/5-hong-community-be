const router = require('express').Router();

const healthCheckRouter = require('./healthCheckRouter');
const memberRouter = require('./memberRouter');
const postRouter = require('./postRouter');

router.use('/ping', healthCheckRouter);
router.use('/members', memberRouter);
router.use('/posts', postRouter);

module.exports = router;
