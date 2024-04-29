const express = require('express');
const cors = require('cors');
const session = require('express-session');

const routes = require('./routes');
const corsOptions = require('./config/corsConfig');
const sessionOptions = require('./config/sessionConfig');
const apiPrefix = '/api/v1';

// ======임시 이미지 업로드======
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
// ======임시 이미지 업로드======

const createApp = () => {
  const app = express();
  app.set('port', process.env.PORT || 8000);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session(sessionOptions));
  app.use(apiPrefix, routes);

  // ======임시 이미지 업로드======
  app.use('/public/images', express.static('public/images'));

  app.post('/api/v1/uploads/image', imageUpload.single('file'), (req, res) => {
      const filename = req.file.filename;
      res.status(200).json({ filename });
    },
  );
  // ======임시 이미지 업로드======

  return app;
};

module.exports = createApp;
