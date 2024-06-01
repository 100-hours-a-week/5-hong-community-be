const { commentDao, postDao } = require('../models');
const { command } = require('../config/database');
const { timeUtils, cursorPageUtils } = require('../utils');

// 10 댓글 씩 전송 (쿼리 요청 -> 10 +1 hasNext 필드)
// 댓글 리스트(무한 스크롤) - [GET] "/api/v1/comments?postId=&cursor="
const sliceCommentList = async (req, res, next) => {
  const { postId, cursor } = req.query;
  const parsedPostId = postId ? parseInt(postId, 10) : 1;
  const parsedCursor = cursor ? parseInt(cursor, 10) : null;

  const commentList =
    await commentDao.findAllByPostIdOrderByIdDesc(parsedPostId, parsedCursor)
      .catch(next);

  const maxViewNum = 5;
  const baseCursor = 'commentId';
  const response = cursorPageUtils.sliceResponse(commentList, maxViewNum, baseCursor);

  return res.status(200).json(response);
};

// 댓글 생성 - [POST] "/api/v1/comments"
const createComment = async (req, res, next) => {
  const currentMember = req.member;  // session 기반

  const { contents, postId } = req.body;
  if (!contents || !postId)
    return res.status(400).json({ message: '필수 필드 누락' });

  const intTypePostId = parseInt(postId);

  // transaction
  return await command(async (conn) => {
    const newComment = {
      contents,
      createdAt: timeUtils.getCurrentTime(),
      ownerId: currentMember.memberId,
      postId: intTypePostId,
      isVisible: true,
    };
    await commentDao.save(newComment, conn);

    const findPost = await postDao.findByIdWithVisible(postId, conn);
    if (!findPost)
      return res.status(404).json({ message: '존재하지 않는 게시글' });

    findPost.commentCount++;  // 댓글 수 증가
    await postDao.save(findPost, conn);

    return res.status(201).json({ message: '새 게시글 생성 완료' });
  }).catch(next);
};

// 댓글 수정 - [PUT] "/api/v1/comments/{id}"
const updateComment = async (req, res, next) => {
  const currentMember = req.member;  // session 기반

  const { contents } = req.body;
  if (!contents)
    return res.status(400).json({ message: '필수 필드 누락' });

  const commentId = parseInt(req.params.id);

  // transaction
  return await command(async (conn) => {
    const findComment = await commentDao.findByIdWithVisible(commentId, conn);
    if (!findComment)
      return res.status(404).json({ message: '없는 댓글임' });

    if (findComment.ownerId !== currentMember.memberId)
      return res.status(403).json({ message: '권한이 없으' });

    findComment.contents = contents;
    await commentDao.save(findComment, conn);

    return res.status(204).end();
  }).catch(next);
};

// 댓글 삭제 - [DELETE] "/api/v1/comments/{id}"
const deleteComment = async (req, res, next) => {
  const currentMember = req.member;  // session 기반

  const commentId = parseInt(req.params.id);

  // transaction
  return await command(async (conn) => {
    const findComment = await commentDao.findByIdWithVisible(commentId, conn);
    if (!findComment)
      return res.status(404).json({ message: '존재하지 않는 댓글' });

    if (findComment.ownerId !== currentMember.memberId)
      return res.status(403).json({ message: '권한이 없으' });

    await commentDao.deleteById(commentId, conn);

    const postId = findComment.postId;
    const findPost = await postDao.findByIdWithVisible(postId, conn);
    if (!findPost)
      return res.status(404).json({ message: '존재하지 않는 게시글' });

    findPost.commentCount--;
    await postDao.save(findPost, conn);

    return res.status(204).end();
  }).catch(next);
};

module.exports = {
  sliceCommentList,
  createComment,
  updateComment,
  deleteComment,
};
