// TODO: page -> cursor

const { postDao } = require('../models');
const { command } = require('../config/database');
const { timeUtils, cursorPageUtils } = require('../utils');

const updateAllowField = ['title', 'contents', 'thumbnail']; // 수정 가능 부분

// 5 게시글 씩 전송 (쿼리 요청 -> 5 +1 hasNext 필드)
// 게시글 리스트(무한 스크롤) - [GET] "/api/v1/posts?page="
const slicePostList = async (req, res, next) => {
  const { page } = req.query;
  const cursor = page ? parseInt(page, 10) : null;

  const postList = await postDao.findAllOrderByIdDesc({ cursor });

  const maxViewNum = 5;
  const baseCursor = 'postId';
  const response = cursorPageUtils.sliceResponse(postList, maxViewNum, baseCursor);

  return res.status(200).json(response);
};

// 게시글 상세 요청시 (hit + 1)
// 게시글 상세 - [GET] "/api/v1/posts/{id}"
const postDetails = async (req, res, next) => {
  const postId = parseInt(req.params.id);

  const findPost = await postDao.findByIdWithOwner({ id: postId });
  if (!findPost)
    return res.status(404).json({ message: '일치하는 게시글 없음' });

  return res.status(200).json(findPost);
};

// 게시글 생성 - [POST] "/api/v1/posts"
const createPost = async (req, res, next) => {
  const currentMember = req.member; // session 기반

  const { title, contents, thumbnail } = req.body;
  if (!title || !contents)
    return res.status(400).json({ message: '필수 필드 누락' });

  // transaction
  return await command(async (conn) => {
    const newPost = {
      title,
      contents,
      createdAt: timeUtils.getCurrentTime(),
      thumbnail,
      commentsCount: 0,
      hitsCount: 0,
      likesCount: 0,
      ownerId: currentMember.memberId,
      isVisible: true,
    };
    await postDao.save({ conn, post: newPost });

    return res.status(201).json({ message: '게시글 생성 완료' });
  });
};

// 게시글 수정 - [PUT] "/api/v1/posts/{id}"
const updatePostDetails = async (req, res, next) => {
  const currentMember = req.member; // session 기반

  const postId = parseInt(req.params.id);

  // transaction
  return await command(async (conn) => {
    const findPost = await postDao.findByIdWithVisible({ conn, id: postId });
    if (!findPost)
      return res.status(404).json({ message: '일치하는 게시글 없음' });

    if (findPost.ownerId !== currentMember.memberId)
      return res.status(403).json({ message: '권한이 없으' });

    Object.keys(req.body).forEach(key => {
      if (updateAllowField.includes(key)) {
        // 수정 허용 부분만 업뎃
        findPost[key] = req.body[key];
      }
    });
    await postDao.save({ conn, post: findPost });

    return res.status(204).end();
  });
};

// 게시글 삭제 - [DELETE] "/api/v1/posts/{id}"
const deletePost = async (req, res, next) => {
  const currentMember = req.member; // session 기반

  const postId = parseInt(req.params.id);

  // transaction
  return await command(async (conn) => {
    const findPost = await postDao.findByIdWithVisible({ conn, id: postId });
    if (!findPost)
      return res.status(404).json({ message: '존재하지 않는 게시글' });

    if (findPost.ownerId !== currentMember.memberId)
      return res.status(403).json({ message: '권한이 없으' });

    await postDao.deleteById({ conn, id: postId });

    return res.status(204).end();
  });
};

module.exports = {
  slicePostList,
  postDetails,
  createPost,
  updatePostDetails,
  deletePost,
};
