const router = require('express').Router();

const healthCheckRouter = require('./healthCheckRouter');

router.use('/ping', healthCheckRouter);

module.exports = router;
