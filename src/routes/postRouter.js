const router = require('express').Router();

const { postController } = require('../controllers');
const { loginRequired } = require('../middlewares/loginRequired');

router.get('/', postController.slicePostList);
router.get('/:id', postController.postDetails);
router.post('/', loginRequired, postController.createPost);
router.put('/:id', loginRequired, postController.updatePostDetails);
router.delete('/:id', loginRequired, postController.deletePost);

module.exports = router;
