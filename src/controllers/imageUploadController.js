const multer = require('multer');
const path = require('path');

const imageStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images'); // 전송된 파일이 저장되는 디렉토리
  },
  filename(req, file, cb) {
    // 시스템 시간으로 파일이름을 변경해서 저장
    cb(null, new Date().valueOf() + path.extname(file.originalname));
  },
});

const imageUpload = multer({ storage: imageStorage });

const uploadImage = (req, res) => {
  console.log(req.file);
  const filename = req.file.filename;
  const image = `http://localhost:8000/public/images/${filename}`;  // 임시
  res.status(200).json({ image });
};

module.exports = {
  imageUpload,
  uploadImage,
};
