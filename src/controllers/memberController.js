const { memberDao } = require('../models');
const { command } = require('../config/database');
const { timeUtils } = require('../utils');

// 본인정보 - [GET] "/api/v1/members"
const me = (req, res, next) => {
  const currentMember = req.member;  // session 기반 인증

  // 비밀번호, 활성상태 부분만 빼고 응답
  const { password, isActive, ...fields } = currentMember;
  return res.status(200).json(fields);
};

// 로그인 - [POST] "/api/v1/members/login"
const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: '필수 필드 누락' });

  const findMember = await memberDao.findByEmailWithActive(email)
    .catch(next);
  if (!findMember)
    return res.status(404).json({ message: '존재하지 않는 이메일' });

  if (findMember.password !== password)
    return res.status(401).json({ message: '일치하지 않는 비밀번호' });

  // session 저장
  req.session.member = { memberId: findMember.memberId };

  return res.status(200).json({ message: '로그인 성공' });
};

// 회원가입 - [POST] "/api/v1/members/signup"
const signup = async (req, res, next) => {
  const { email, password, nickname, profileImage } = req.body;
  if (!email || !password || !nickname || !profileImage)
    return res.status(400).json({ message: '필수 필드 누락' });

  // transaction
  return await command(async (conn) => {
    const byEmail = await memberDao.findByEmail(email, conn);
    if (byEmail)
      return res.status(409).json({ message: '이메일 중복' });

    const byNickname = await memberDao.findByNickname(nickname, conn);
    if (byNickname)
      return res.status(409).json({ message: '닉네임 중복' });

    const newMember = {
      email,
      password,
      nickname,
      profileImage,
      createdAt: timeUtils.getCurrentTime(),
      isActive: true,
    };
    await memberDao.save(newMember, conn);

    return res.status(201).json({ message: '회원가입 성공' });
  }).catch(next);
};

// 로그아웃 - [POST] "/api/v1/members/logout"
const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.status(200).json({ message: '바이바이' });
  });
};

// 닉네임 수정 - [PUT] "/api/v1/members/nickname"
const updateNickname = async (req, res, next) => {
  const currentMember = req.member;  // session 기반 인증

  const { nickname } = req.body;
  if (!nickname)
    return res.status(400).json({ message: '필수 필드 누락' });

  // transaction
  return await command(async (conn) => {
    const isExist = await memberDao.findByNickname(nickname, conn);
    if (isExist)
      return res.status(409).json({ message: '이미 존재하는 닉네임' });

    currentMember.nickname = nickname;
    await memberDao.save(currentMember, conn);

    return res.status(204).end();
  }).catch(next);
};

// 프로필 수정 (닉네임 이미지) - [PATCH] "/api/v1/members/profile"
const updateProfile = async (req, res, next) => {
  const currentMember = req.member;  // session 기반 인증

  const { nickname, profileImage } = req.body;
  if (!profileImage && !nickname)
    return res.status(400).json({ message: '수정할 필드가 없음.' });

  // transaction
  return await command(async (conn) => {
    const isExist = await memberDao.findByNickname(nickname, conn);
    if (isExist)
      return res.status(409).json({ message: '이미 존재하는 닉네임' });

    currentMember.profileImage = profileImage;
    currentMember.nickname = nickname;
    await memberDao.save(currentMember, conn);

    return res.status(204).end();
  }).catch(next);
};

// 비밀번호 수정 - [PUT] "/api/v1/members/password"
const updatePassword = async (req, res, next) => {
  const currentMember = req.member; // session 기반 인증

  const { password } = req.body;
  if (!password)
    return res.status(400).json({ message: '필수 필드 누락' });

  // transaction
  return await command(async (conn) => {
    currentMember.password = password;
    await memberDao.save(currentMember, conn);

    return res.status(204).end();
  }).catch(next);
};

// 회원 탈퇴 - [DELETE] "/api/v1/member"
const withdraw = async (req, res, next) => {
  const currentMember = req.member;  // session 기반 인증
  const memberId = currentMember.memberId;

  // transaction
  return await command(async (conn) => {
    await memberDao.deleteById(memberId, conn);

    return res.status(204).end();
  }).catch(next);
};

module.exports = {
  me,
  login,
  signup,
  logout,
  updateNickname,
  updateProfile,
  updatePassword,
  withdraw,
};
