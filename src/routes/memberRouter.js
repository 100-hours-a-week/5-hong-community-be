const router = require('express').Router();

const { memberController, memberValidateController } = require('../controllers');
const { loginRequired } = require('../middlewares/loginRequired');

// TODO: 이미지 업로드 추가 해야함

// member API
router.post('/login', memberController.login);
router.post('/signup', memberController.signup);
router.get('/', loginRequired, memberController.me);
router.post('/logout', loginRequired, memberController.logout);
router.put('/nickname', loginRequired, memberController.updateNickname);
router.put('/password', loginRequired, memberController.updatePassword);
router.patch('/profile', loginRequired, memberController.updateProfile);
router.delete('/', loginRequired, memberController.withdraw);

// member validate API
router.post('/email', memberValidateController.validateEmail);
router.post('/nickname', memberValidateController.validateNickname);

module.exports = router;
