const router = require('express').Router();

const { postController } = require('../controllers');

router.get('/', postController.slicePostList);
router.get('/:id', postController.postsDetails);
router.post('/', postController.createPosts);
router.put('/:id', postController.updatePostsDetails);
router.delete('/:id', postController.deletePosts);

module.exports = router;
