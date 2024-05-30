const { query } = require('../config/database');
const { conversionUtils } = require('../utils');

// command executor

const save = async ({ conn, member }) => {
  if (!member.memberId) {
    const [result] = await conn.query(  // insert query
      `INSERT INTO member (email, password, nickname, profile_image)
       VALUES (?, ?, ?, ?)`,
      [member.email, member.password, member.nickname, member.profileImage],
    );
    return result.insertId;
  }

  const [result] = await conn.query(  // update query
    `UPDATE member
     SET email         = ?,
         password      = ?,
         nickname      = ?,
         profile_image = ?
     WHERE member_id = ?`,
    [member.email, member.password, member.nickname, member.profileImage, member.memberId],
  );
  return result.insertId;
};

const deleteById = async ({ conn, id }) => {
  const [result] = await conn.query(
    `UPDATE member
     SET is_active = FALSE
     WHERE member_id = ?`,
    [id],
  );
  return result.insertId;
};

// query executor

const findById = async ({ conn, id }) => {
  const sql = `SELECT *
               FROM member
               WHERE member_id = ?
                 AND is_active = TRUE`;
  const values = [id];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

  return conversionUtils.snakeToCamel(rows[0]);
};

const findByIdAllowNotActive = async ({ conn, id }) => {
  const sql = `SELECT *
               FROM member
               WHERE member_id = ?`;
  const values = [id];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

  return conversionUtils.snakeToCamel(rows[0]);
};

const findByNickname = async ({ conn, nickname }) => {
  const sql = `SELECT *
               FROM member
               WHERE nickname = ?`;
  const values = [nickname];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

  return conversionUtils.snakeToCamel(rows[0]);
};

const findByEmail = async ({ conn, email }) => {
  const sql = `SELECT *
               FROM member
               WHERE email = ?`;
  const values = [email];

  let rows;
  if (conn)
    rows = await conn.query(sql, values);
  else
    rows = await query(sql, values);

  return conversionUtils.snakeToCamel(rows[0]);
};

const findByEmailWithActive = async ({ conn, email }) => {
  const sql = `SELECT *
               FROM member
               WHERE email = ?
                 AND is_active = TRUE`;
  const values = [email];

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
  findById,
  findByIdAllowNotActive,
  findByNickname,
  findByEmail,
  findByEmailWithActive,
};
