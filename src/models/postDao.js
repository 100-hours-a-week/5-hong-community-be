const { executeQuery } = require('../config/database');
const { conversionUtils } = require('../utils');

// command executor

const save = async (post, conn) => {
  if (post.postId) {
    return await updatePost(post, conn);
  }
  return await insertPost(post, conn);
};

const insertPost = async (post, conn) => {
  const sql = `
      INSERT INTO post (owner_id, title, contents, thumbnail, created_at)
      VALUES (?, ?, ?, ?, ?)
  `;
  const values = [post.ownerId, post.title, post.contents, post.thumbnail, post.createdAt];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

const updatePost = async (post, conn) => {
  const sql = `
      UPDATE post
      SET title         = ?,
          contents      = ?,
          thumbnail     = ?,
          hit_count     = ?,
          comment_count = ?
      WHERE post_id = ?
  `;
  const values = [post.title, post.contents, post.thumbnail, post.hitCount, post.commentCount, post.postId];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

const deleteById = async (id, conn) => {
  const sql = `
      UPDATE post
      SET is_visible = FALSE
      WHERE post_id = ?
  `;
  const values = [id];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

// query executor

// 실제로는 5개만 보여줄 거지만 +1 즉, 6개를 검색해서 hasNext 를 만듬
const findAllOrderByIdDesc = async (cursor, conn) => {
  const orderAndLimitClause = `
    ORDER BY p.post_id DESC
    LIMIT 6
  `;

  const sql = `
      SELECT p.post_id,
             p.title,
             p.contents,
             p.created_at,
             p.thumbnail,
             p.is_visible,
             m.member_id,
             m.nickname,
             m.profile_image
      FROM post p
               JOIN member m ON p.owner_id = m.member_id
      WHERE p.is_visible = TRUE
          ${cursor ? `AND p.post_id <= ?` : ''} ${orderAndLimitClause}
  `;
  const values = cursor ? [cursor] : [];

  const rows = await executeQuery(sql, values, conn);

  return rows.map((row) => {
    const { memberId, nickname, profileImage, ...rest } = conversionUtils.snakeToCamel(row);
    return {
      ...rest,
      owner: {
        memberId,
        nickname,
        profileImage,
      },
    };
  });
};

const findByIdWithVisible = async (id, conn) => {
  const sql = `
      SELECT *
      FROM post
      WHERE post_id = ?
        AND is_visible = TRUE
  `;
  const values = [id];
  const rows = await executeQuery(sql, values, conn);
  return conversionUtils.snakeToCamel(rows[0]);
};

const findByIdWithOwner = async (id, conn) => {
  const sql = `
      SELECT p.*, m.member_id, m.nickname, m.profile_image
      FROM post p
               JOIN member m ON p.owner_id = m.member_id
      WHERE post_id = ?
  `;
  const values = [id];

  const rows = await executeQuery(sql, values, conn);

  const { memberId, nickname, profileImage, ...rest } = conversionUtils.snakeToCamel(rows[0]);
  return {
    ...rest,
    owner: {
      memberId,
      nickname,
      profileImage,
    },
  };
};

module.exports = {
  save,
  deleteById,
  findAllOrderByIdDesc,
  findByIdWithVisible,
  findByIdWithOwner,
};
