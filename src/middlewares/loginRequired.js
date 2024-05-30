const { memberDao } = require('../models');

const loginRequired = async (req, res, next) => {
  const session = req.session.member;

  if (!session) {
    return res.status(401).json({ message: '로그인 하셍' });
  }

  const memberId = session.memberId;
  const findMember = await memberDao.findById(memberId);
  if (!findMember) {
    return res.status(404).json({ message: '존재하지 않는 사용자' });
  }

  // request 의 member 로 회원 정보를 넘겨주기
  req.member = findMember;

  next();
};

module.exports = {
  loginRequired,
};
