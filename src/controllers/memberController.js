// TODO: 1) 중복 코드 리팩토링
//       2) 서비스 로직 분리해야함
//       3) 현재 인증/인가 로직이 없음
//       4) 프로필 이미지 변경
//       5) password crypto
//       6) 엔티티 자체 반환 문제 DTO -> global ApiResponseEntity

const { memberDao } = require('../models');
const { timeUtils } = require('../utils');

// 본인정보 - [GET] "/api/v1/members/{id}" (legacy)
// 본인정보 - [GET] "/api/v1/members"
const me = (req, res, next) => {
  // TODO: JWT 기반으로 변경해야함.

  // const memberId = parseInt(req.params.id);
  // const findMember = memberDao.findById(memberId);

  const findMember = req.member;  // session 기반 인증

  // 해당 회원이 없는 경우
  if (!findMember) {
    return res.status(404).json({ message: '존재하지 않는 회원' });
  }

  // 임시: 비밀번호, 활성상태 부분만 빼고 응답
  const { password, isActive, ...visibleFields } = findMember;
  return res.status(200).json(visibleFields);
};

// 로그인 - [POST] "/api/v1/members/login"
const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: '필수 필드 누락' });
  }

  const findMember = memberDao.findByEmail(email);
  if (!findMember) {
    return res.status(404).json({ message: '존재하지 않는 이메일' });
  }

  if (findMember.password !== password) {
    return res.status(401).json({ message: '일치하지 않는 비밀번호' });
  }

  // session 저장
  req.session.member = { memberId: findMember.memberId };

  return res.status(200).json({ message: '로그인 성공' });
};

// 회원가입 - [POST] "/api/v1/members/signup"
const signup = (req, res, next) => {
  const { email, password, nickname } = req.body;
  if (!email || !password || !nickname) {
    return res.status(400).json({ message: '필수 필드 누락' });
  }

  const byEmail = memberDao.findByEmail(email);
  if (byEmail) {
    return res.status(409).json({ message: '이메일 중복' });
  }

  const byNickname = memberDao.findByNickname(nickname);
  if (byNickname) {
    return res.status(409).json({ message: '닉네임 중복' });
  }

  // id는 repository 에서
  const newMember = {
    email,
    password,
    nickname,
    createdAt: timeUtils.getCurrentTime(),
    profileImage: 'https://avatars.githubusercontent.com/u/144337839?v=4',
    isActive: true,
  };
  memberDao.save(newMember);

  return res.status(201).json({ message: '회원가입 성공' });
};

// 로그아웃 - [POST] "/api/v1/members/logout"
const logout = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      throw error;
    }
    res.status(200).json({ message: '바이바이' });
  });
};

// 닉네임 수정 - [PUT] "/api/v1/members/{id}/nickname" (legacy)
// 닉네임 수정 - [PUT] "/api/v1/members/nickname"
const updateNickname = (req, res, next) => {
  const { nickname } = req.body;
  if (!nickname) {
    return res.status(400).json({ message: '필수 필드 누락' });
  }

  const isExist = memberDao.findByNickname(nickname);
  if (isExist) {
    return res.status(409).json({ message: '이미 존재하는 닉네임' });
  }

  // const memberId = parseInt(req.params.id);
  // const findMember = memberDao.findById(memberId);
  // if (!findMember) {
  //   return res.status(404).json({ message: '존재하지 않는 회원' });
  // }

  const findMember = req.member;  // session 기반 인증

  findMember.nickname = nickname;
  memberDao.save(findMember);

  return res.status(204).end();
};

// 비밀번호 수정 - [PUT] "/api/v1/members/{id}/password" (legacy)
// 비밀번호 수정 - [PUT] "/api/v1/members/password"
const updatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ message: '필수 필드 누락' });
  }

  // const memberId = parseInt(req.params.id);
  // const findMember = memberDao.findById(memberId);
  // if (!findMember) {
  //   return res.status(404).json({ message: '존재하지 않는 회원' });
  // }

  const findMember = req.member;  // session 기반 인증

  findMember.password = password;
  memberDao.save(findMember);

  return res.status(204).end();
};

// 회원 탈퇴 - [DELETE] "/api/v1/member/{id}" (legacy)
// 회원 탈퇴 - [DELETE] "/api/v1/member"
const withdraw = (req, res, next) => {
  // const memberId = parseInt(req.params.id);
  // const findMember = memberDao.findById(memberId);
  // if (!findMember) {
  //   return res.status(404).json({ message: '존재하지 않는 사용자' });
  // }

  const findMember = req.member;  // session 기반 인증
  const memberId = findMember.memberId;

  memberDao.deleteById(memberId);

  return res.status(204).end();
};

module.exports = {
  me,
  login,
  signup,
  logout,
  updateNickname,
  updatePassword,
  withdraw,
};
