const router = require('express').Router();

const { commentController } = require('../controllers');
const { loginRequired } = require('../middlewares/loginRequired');

router.get('/', commentController.sliceCommentList);
// router.post('/', commentController.createComment);  // legacy
// router.put('/:id', commentController.updateComment);  // legacy
// router.delete('/:id', commentController.deleteComment);  // legacy
router.post('/', loginRequired, commentController.createComment);
router.put('/:id', loginRequired, commentController.updateComment);
router.delete('/:id', loginRequired, commentController.deleteComment);

module.exports = router;
