const router = require('express').Router();

const { postController } = require('../controllers');
const { loginRequired } = require('../middlewares/loginRequired');

router.get('/', postController.slicePostList);
router.get('/:id', postController.postsDetails);
// router.post('/', postController.createPosts);  // legacy
// router.put('/:id', postController.updatePostsDetails);  // legacy
// router.delete('/:id', postController.deletePosts);  // legacy
router.post('/', loginRequired, postController.createPosts);
router.put('/:id', loginRequired, postController.updatePostsDetails);
router.delete('/:id', loginRequired, postController.deletePosts);

module.exports = router;
