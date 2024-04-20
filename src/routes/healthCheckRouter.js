const router = require('express').Router();

const { healthCheckController } = require('../controllers');

router.get('/', healthCheckController.healthCheck);

module.exports = router;
