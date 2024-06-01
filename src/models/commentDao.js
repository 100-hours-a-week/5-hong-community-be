const { executeQuery } = require('../config/database');
const { conversionUtils } = require('../utils');

// command executor

const save = async (comment, conn) => {
  if (comment.commentId) {
    return await updateComment(comment, conn);
  }
  return await insertComment(comment, conn);
};

const insertComment = async (comment, conn) => {
  const sql = `
      INSERT INTO comment (owner_id, post_id, contents)
      VALUES (?, ?, ?)
  `;
  const values = [comment.ownerId, comment.postId, comment.contents];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

const updateComment = async (comment, conn) => {
  const sql = `
      UPDATE comment
      SET contents = ?
      WHERE comment_id = ?
  `;
  const values = [comment.contents, comment.commentId];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

const deleteById = async (id, conn) => {
  const sql = `
      UPDATE comment
      SET is_visible = FALSE
      WHERE comment_id = ?
  `;
  const values = [id];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

// query executor

const findAllByPostIdOrderByIdDesc = async (postId, cursor, conn) => {
  const orderAndLimitClause = `
    ORDER BY c.comment_id DESC
    LIMIT 11
  `;

  const sql = `
      SELECT c.*, m.member_id, m.nickname, m.profile_image
      FROM comment c
               LEFT JOIN member m ON c.owner_id = m.member_id
      WHERE c.post_id = ?
        AND c.is_visible = TRUE
          ${cursor ? `AND c.comment_id <= ?` : ''} ${orderAndLimitClause}
  `;
  const values = cursor ? [postId, cursor] : [postId];

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
      FROM comment
      WHERE comment_id = ?
        AND is_visible = TRUE
  `;
  const values = [id];
  const rows = await executeQuery(sql, values, conn);
  return conversionUtils.snakeToCamel(rows[0]);
};

const findByIdWithOwner = async (id, conn) => {
  const sql = `
      SELECT c.*, m.member_id, m.nickname, m.profile_image
      FROM comment c
               JOIN member m ON c.owner_id = m.member_id
      WHERE comment_id = ?
        AND is_visible = TRUE
  `;
  const values = [id];
  const rows = await executeQuery(sql, values, conn);
  return conversionUtils.snakeToCamel(rows[0]);
};

module.exports = {
  save,
  deleteById,
  findByIdWithVisible,
  findByIdWithOwner,
  findAllByPostIdOrderByIdDesc,
};
