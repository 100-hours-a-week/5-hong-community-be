// TODO: 1) 중복 코드 리팩토링
//       2) 서비스 로직 분리해야함
//       3) global ApiResponseEntity 구현

const { memberDao } = require('../models');

// 닉네임 중복 체크 - [POST] "/api/v1/members/nickname"
const validateNickname = (req, res, next) => {
  const { nickname } = req.body;

  const findMember = memberDao.findByNickname(nickname);
  if (!findMember) {
    return res.status(200).send({ message: '유효성 검사 통과' });
  }
  return res.status(409).send({ message: '중복된 닉네임' });
};

// 이메일 중복 체크 - [POST] "/api/v1/members/email"
const validateEmail = (req, res, next) => {
  const { email } = req.body;

  const findMember = memberDao.findByEmail(email);
  if (!findMember) {
    return res.status(200).send({ message: '유효성 검사 통과' });
  }
  return res.status(400).send({ message: '중복된 이메일 입니다' });
};

module.exports = {
  validateEmail,
  validateNickname,
};
