// TODO: 1) 중복 코드 리팩토링
//       2) 서비스 로직 분리해야함
//       3) 현재 인증/인가 로직이 없음
//       4) 엔티티 자체 반환 문제 DTO

const { postDao, commentDao } = require('../models');
const { timeUtils, pagination } = require('../utils');

// TODO: 댓글 작성자 임시 (JWT 구현완료시 삭제)
const tempPostsOwnerId = 1;

// 10 댓글 씩 전송 (쿼리 요청 -> 10 +1 hasNext 필드)
// 댓글 리스트(무한 스크롤) - [GET] "/api/v1/comments?postsId=&page="
const sliceCommentList = (req, res, next) => {
  const { postsId, page } = req.query;
  const parsedPostsId = postsId ? parseInt(postsId, 10) : 1;
  const parsedPage = page ? parseInt(page, 10) : 1;

  // hasNext, nextPage, data
  const sliceComments = commentDao.findAllByPostsIdOrderByIdDesc(parsedPostsId, parsedPage);
  // ownerId 의 세부정보로 변환
  const paginationResponse = pagination.convertOwnerInfo(sliceComments);

  return res.status(200).send(paginationResponse);
};

// 댓글 생성 - [POST] "/api/v1/comments"
const createComment = (req, res, next) => {
  const { contents, postsId } = req.body;
  if (!contents || !postsId) {
    return res.status(400).send({ message: '필수 필드 누락' });
  }

  const newComments = {
    contents,
    createdAt: timeUtils.getCurrentTime(),
    ownerId: tempPostsOwnerId,  // 임시 아이디
    postsId: postsId,
    isVisible: true,
  };
  commentDao.save(newComments);

  // 종속된 게시글의 댓글 수 +1
  const findPosts = postDao.findById(postsId);
  findPosts.commentsCount = findPosts.commentsCount + 1;
  postDao.save(findPosts);

  return res.status(201).send({ message: '새 게시글 생성 완료' });
};

// 댓글 수정 - [PUT] "/api/v1/comments/{id}"
const updateComment = (req, res, next) => {
  const commentsId = parseInt(req.params.id);

  const { contents } = req.body;
  if (!contents) {
    return res.status(400).send({ message: '필수 필드 누락' });
  }

  const findComments = commentDao.findById(commentsId);
  findComments.contents = contents;

  commentDao.save(findComments);
  return res.status(204).end();
};

// 댓글 삭제 - [DELETE] "/api/v1/comments/{id}"
const deleteComment = (req, res, next) => {
  const commentsId = parseInt(req.params.id);

  const findComments = commentDao.findById(commentsId);
  if (!findComments) {
    return res.status(404).send({ message: '존재하지 않는 댓글' });
  }

  return res.status(204).end();
};

module.exports = {
  sliceCommentList,
  createComment,
  updateComment,
  deleteComment,
};
