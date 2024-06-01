const { memberDao } = require('../models');

// 닉네임 중복 체크 - [POST] "/api/v1/members/nickname"
const validateNickname = async (req, res, next) => {
  const { nickname } = req.body;
  if (!nickname)
    return res.status(400).json({ message: '필수 필드 누락' });

  const findMember = await memberDao.findByNickname(nickname)
    .catch(next);

  if (findMember)
    return res.status(409).send({ message: '중복된 닉네임' });

  return res.status(200).send({ message: '유효성 검사 통과' });
};

// 이메일 중복 체크 - [POST] "/api/v1/members/email"
const validateEmail = async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ message: '필수 필드 누락' });

  const findMember = await memberDao.findByEmail(email)
    .catch(next);

  if (findMember)
    return res.status(400).send({ message: '중복된 이메일 입니다' });

  return res.status(200).send({ message: '유효성 검사 통과' });
};

module.exports = {
  validateEmail,
  validateNickname,
};
