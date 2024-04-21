const router = require('express').Router();

const { memberValidateController } = require('../controllers');

// member validate API
router.post('/email', memberValidateController.validateEmail);
router.post('/nickname', memberValidateController.validateNickname);

module.exports = router;
