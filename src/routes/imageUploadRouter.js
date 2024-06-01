const router = require('express').Router();

const { imageUpload, uploadImage } = require('../controllers/imageUploadController');

router.post('/image', imageUpload.single('file'), uploadImage);

module.exports = router;
