const router = require('express').Router();

const { memberController, memberValidateController } = require('../controllers');

// TODO: 이미지 업로드 추가 해야함

// member API
router.get('/:id', memberController.me);
router.post('/login', memberController.login);
router.post('/signup', memberController.signup);
router.put('/:id/nickname', memberController.updateNickname);
router.put('/:id/password', memberController.updatePassword);
router.delete('/:id', memberController.withdraw);

// member validate API
router.post('/email', memberValidateController.validateEmail);
router.post('/nickname', memberValidateController.validateNickname);

module.exports = router;
