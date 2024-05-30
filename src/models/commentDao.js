const { query } = require('../config/database');
const { conversionUtils } = require('../utils');

// command executor

const save = async ({ conn, comment }) => {
  if (!comment.commentId) {
    const [result] = await conn.query(  // insert query
      `INSERT INTO comment (owner_id, post_id, contents)
       VALUES (?, ?, ?)`,
      [comment.ownerId, comment.postId, comment.contents],
    );
    return result.insertId;
  }

  const [result] = await conn.query( // update query
    `UPDATE comment
     SET contents = ?
     WHERE comment_id = ?`,
    [comment.contents, comment.commentId],
  );
  return result.insertId;
};

const deleteById = async ({ conn, id }) => {
  const [result] = await conn.query(
    `UPDATE comment
     SET is_visible = FALSE
     WHERE comment_id = ?`,
    [id],
  );
  return result.insertId;
};

// query executor

const findAllByPostIdOrderByIdDesc = async ({ conn, postId, cursor, limit = 11 }) => {
  const orderAndLimitClause = `
    ORDER BY c.comment_id DESC
    LIMIT ?
  `;

  const sql = `SELECT c.*, m.member_id, m.nickname, m.profile_image
               FROM comment c
                        LEFT JOIN member m ON c.owner_id = m.member_id
               WHERE c.post_id = ?
                 AND c.is_visible = TRUE
                   ${cursor ? `AND c.comment_id <= ?` : ''} ${orderAndLimitClause}`;
  const values = cursor ? [postId, cursor, limit] : [postId, limit];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

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

const findByIdWithVisible = async ({ conn, id }) => {
  const sql = `SELECT *
               FROM comment
               WHERE comment_id = ?
                 AND is_visible = TRUE`;
  const values = [id];

  let rows;
  if (conn)
    rows = await conn.query(sql, [id]);
  else
    rows = await query(sql, values);

  return conversionUtils.snakeToCamel(rows[0]);
};

const findByIdWithOwner = async ({ conn, id }) => {
  const sql = `SELECT c.*, m.member_id, m.nickname, m.profile_image
               FROM comment c
                        JOIN member m ON c.owner_id = m.member_id
               WHERE comment_id = ?
                 AND is_visible = TRUE`;
  const values = [id];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

  return conversionUtils.snakeToCamel(rows[0]);
};

module.exports = {
  save,
  deleteById,
  findByIdWithVisible,
  findByIdWithOwner,
  findAllByPostIdOrderByIdDesc,
};
