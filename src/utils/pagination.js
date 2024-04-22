const { memberDao } = require('../models');

// TODO: 네이밍 맘에 안듬, utils 클래스 말고 다른곳?
const convertOwnerInfo = (sliceData) => {
  if (!sliceData.data) {
    return;
  }

  sliceData.data = sliceData.data.map((data) =>
    _convertOwnerInfo(data),
  );
  return sliceData;
};

// TODO: 네이밍
// ownerId 필드를 member 상세 정보로 바꿈
const _convertOwnerInfo = (data) => {
  const { ownerId, ...rest } = data;
  const findMember = memberDao.findByIdAllowNotActive(ownerId);

  // ownerId 에 해당하는 멤버가 존재할 경우?
  if (findMember) {
    const owner = {
      memberId: ownerId,
      nickname: findMember.nickname,
      profileImage: findMember.profileImage,
    };
    return { ...rest, owner };
  }
  throw new Error('owner info 로 변경 중 존재하지 않는 owner 가 있음 - 서버 (로직) 오류');
};

module.exports = {
  convertOwnerInfo,
  _convertOwnerInfo,
};
