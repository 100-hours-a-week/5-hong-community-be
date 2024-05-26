// TODO: 1) JWT 구현 후 권한 설정
//       2) response dto

const { postDao } = require('../models');
const { timeUtils, pagination } = require('../utils');

// TODO: 게시글 작성자 임시 (JWT 구현중)
// const tempPostsOwnerId = 1;

const updateAllowField = ['title', 'contents', 'thumbnail']; // 수정 가능 부분

// 5 게시글 씩 전송 (쿼리 요청 -> 5 +1 hasNext 필드)
// 게시글 리스트(무한 스크롤) - [GET] "/api/v1/posts?page="
const slicePostList = (req, res, next) => {
  const { page } = req.query;
  const nowPage = page ? parseInt(page, 10) : 1;

  // hasNext, nextPage, data
  const slicePosts = postDao.findAllOrderByIdDesc(nowPage);
  // ownerId 의 세부정보로 변환
  const paginationResponse = pagination.convertOwnerInfo(slicePosts);

  return res.status(200).json(paginationResponse);
};

// 게시글 상세 요청시 (hit + 1)
// 게시글 상세 - [GET] "/api/v1/posts/{id}"
const postsDetails = (req, res, next) => {
  const postsId = parseInt(req.params.id);

  const findPosts = postDao.findById(postsId);
  if (!findPosts) {
    return res.status(404).json({ message: '일치하는 게시글 없음' });
  }

  // 조회수 + 1
  findPosts.hitsCount = findPosts.hitsCount + 1;
  postDao.save(findPosts);

  const response = pagination._convertOwnerInfo(findPosts);
  return res.status(200).json(response);
};

// 게시글 생성 - [POST] "/api/v1/posts"
const createPosts = (req, res, next) => {
  const { title, contents, thumbnail } = req.body;
  if (!title || !contents) {
    return res.status(400).json({ message: '필수 필드 누락' });
  }

  const nowMember = req.member; // session 기반

  const newPosts = {
    title,
    contents,
    createdAt: timeUtils.getCurrentTime(),
    thumbnail,
    commentsCount: 0,
    hitsCount: 0,
    likesCount: 0,
    // ownerId: tempPostsOwnerId,  // 임시 아이디
    ownerId: nowMember.memberId,
    isVisible: true,
  };
  postDao.save(newPosts);

  return res.status(201).json({ message: '게시글 생성 완료' });
};

// 게시글 수정 - [PUT] "/api/v1/posts/{id}"
const updatePostsDetails = (req, res, next) => {
  const postsId = parseInt(req.params.id);

  const findPosts = postDao.findById(postsId);
  if (!findPosts) {
    return res.status(404).json({ message: '일치하는 게시글 없음' });
  }

  const nowMember = req.member; // session 기반
  if (findPosts.ownerId !== nowMember.memberId) {
    return res.status(403).json({ message: '권한이 없으' });
  }

  Object.keys(req.body).forEach(key => {
    if (updateAllowField.includes(key)) {
      // 수정 허용 부분만 업뎃
      findPosts[key] = req.body[key];
    }
  });
  postDao.save(findPosts);

  return res.status(204).end();
};

// 게시글 삭제 - [DELETE] "/api/v1/posts/{id}"
const deletePosts = (req, res, next) => {
  const postsId = parseInt(req.params.id);

  const findPosts = postDao.findById(postsId);
  if (!findPosts) {
    return res.status(404).json({ message: '존재하지 않는 게시글' });
  }

  const nowMember = req.member; // session 기반
  if (findPosts.ownerId !== nowMember.memberId) {
    return res.status(403).json({ message: '권한이 없으' });
  }

  postDao.deleteById(postsId);

  return res.status(204).end();
};

module.exports = {
  slicePostList,
  postsDetails,
  createPosts,
  updatePostsDetails,
  deletePosts,
};
