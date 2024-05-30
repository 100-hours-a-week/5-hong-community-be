const { query } = require('../config/database');
const { conversionUtils } = require('../utils');

// command executor

const save = async ({ conn, post }) => {
  if (!post.postId) {
    const [result] = await conn.query(  // insert query
      `INSERT INTO post (owner_id, title, contents, thumbnail, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      [post.ownerId, post.title, post.contents, post.thumbnail, post.createdAt],
    );
    return result.insertId;
  }

  const [result] = await conn.query(  // update query
    `UPDATE post
     SET title     = ?,
         contents  = ?,
         thumbnail = ?
     WHERE post_id = ?`,
    [post.title, post.contents, post.thumbnail, post.postId],
  );
  return result.insertId;
};

const deleteById = async ({ conn, id }) => {
  const [result] = await conn.query(
    `UPDATE post
     SET is_visible = FALSE
     WHERE post_id = ?`,
    [id],
  );
  return result.insertId;
};

// query executor

// 실제로는 5개만 보여줄 거지만 +1 즉, 6개를 검색해서 hasNext 를 만듬
const findAllOrderByIdDesc = async ({ conn, cursor, limit = 6 }) => {
  const orderAndLimitClause = `
    ORDER BY p.post_id DESC
    LIMIT ?
  `;

  const sql = `SELECT p.post_id,
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
                   ${cursor ? `AND p.post_id <= ?` : ''} ${orderAndLimitClause}`;
  const values = cursor ? [cursor, limit] : [limit];

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
               FROM post
               WHERE post_id = ?
                 AND is_visible = TRUE`;
  const values = [id];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

  return conversionUtils.snakeToCamel(rows[0]);
};

const findByIdWithOwner = async ({ conn, id }) => {

  const sql = `SELECT p.*, m.member_id, m.nickname, m.profile_image
               FROM post p
                        JOIN member m ON p.owner_id = m.member_id
               WHERE post_id = ?`;
  const values = [id];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

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
