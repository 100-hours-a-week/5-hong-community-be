// default members data

// TODO: 1) profile 이미지 빼먹음 (임시로 완)
//       2) createdAt 일단 생략
//       3) lastLogin 추가?

const members = [
  {
    memberId: 1,
    email: 'kinjihong@naver.com',
    password: '123!@#qwe',
    nickname: 'hong.kim',
    createdAt: '2024-01-01 12:34:56',
    profileImage: 'https://avatars.githubusercontent.com/u/144337839?v=4',
    isActive: true,
  },
  {
    memberId: 2,
    email: 'kinjihong9598@gmail.com',
    password: '123!@#qwe',
    nickname: '하이요',
    createdAt: '2024-01-02 12:34:56',
    profileImage: 'https://avatars.githubusercontent.com/u/144337839?v=4',
    isActive: true,
  },
  {
    memberId: 3,
    email: 'user@example.com',
    password: '123!@#qwe',
    nickname: '김지홍',
    createdAt: '2024-01-03 12:34:56',
    profileImage: 'https://avatars.githubusercontent.com/u/144337839?v=4',
    isActive: true,
  },
  {
    memberId: 4,
    email: 'demo@example.com',
    password: '123!@#qwe',
    nickname: '하암',
    createdAt: '2024-01-04 12:34:56',
    profileImage: 'https://avatars.githubusercontent.com/u/144337839?v=4',
    isActive: true,
  },
];

module.exports = members;
