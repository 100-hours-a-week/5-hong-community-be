// TODO: repository 메서드 중복 (member, post, comment) 리팩토링

// 일단은 in-memory DB
const { members } = require('./data');

// 시작 ID
let sequenceId = 5;

const save = (member) => {
  // memberId 가 없는 경우 (insert)
  if (!member.memberId) {
    member.memberId = sequenceId;
    members.push(member);
    sequenceId++;
    return;
  }

  // memberId 가 있는 경우 (update)
  const memberId = member.memberId;
  const index = members.findIndex(member =>
    member.memberId === memberId &&
    member.isActive,
  );

  if (index !== -1) {
    members[index] = member;
    return;
  }
  throw new Error('존재하지 않는 회원 - 서버 (로직) 오류');
};

// 실제로 삭제하지 않고 isActive 만 false
const deleteById = (id) => {
  const index = members.findIndex((member) =>
    member.memberId === id &&
    member.isActive,
  );

  if (index !== -1) {  // 해당 회원을 비활성화로 변경
    members[index].isActive = false;
    return;
  }
  throw new Error('존재하지 않는 회원 - 서버 (로직) 오류');
};

const findById = (memberId) => {
  return members.find((member) =>
    member.memberId === memberId &&
    member.isActive,
  );
};

// TODO: 네이밍 변경
// isActive 가 false => 즉, 탈퇴한 회원에서도 가져옴
const findByIdAllowNotActive = (memberId) => {
  return members.find((member) =>
    member.memberId === memberId,
  );
};

const findByNickname = (nickname) => {
  return members.find((member) =>
    member.nickname === nickname &&
    member.isActive,
  );
};

const findByEmail = (email) => {
  return members.find((member) =>
    member.email === email &&
    member.isActive,
  );
};

module.exports = {
  save,
  deleteById,
  findById,
  findByIdAllowNotActive,
  findByNickname,
  findByEmail,
};
