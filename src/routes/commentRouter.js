const router = require('express').Router();

const { commentController } = require('../controllers');

router.get('/', commentController.sliceCommentList);
router.post('/', commentController.createComment);
router.put('/:id', commentController.updateComment);
router.delete('/:id', commentController.deleteComment);

module.exports = router;
