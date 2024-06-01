const { executeQuery } = require('../config/database');
const { conversionUtils } = require('../utils');

// command executor

const save = async (member, conn) => {
  if (member.memberId) {
    return await updateMember(member, conn);
  }
  return await insertMember(member, conn);
};

const insertMember = async (member, conn) => {
  const sql = `
      INSERT INTO member (email, password, nickname, profile_image)
      VALUES (?, ?, ?, ?)
  `;
  const values = [member.email, member.password, member.nickname, member.profileImage];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

const updateMember = async (member, conn) => {
  const sql = `
      UPDATE member
      SET email         = ?,
          password      = ?,
          nickname      = ?,
          profile_image = ?
      WHERE member_id = ?
  `;
  const values = [member.email, member.password, member.nickname, member.profileImage, member.memberId];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

const deleteById = async (id, conn) => {
  const sql = `
      UPDATE member
      SET is_active = FALSE
      WHERE member_id = ?
  `;
  const values = [id];
  const result = await executeQuery(sql, values, conn);
  return result.insertId;
};

// query executor

const findById = async (id, conn) => {
  const sql = `
      SELECT *
      FROM member
      WHERE member_id = ?
        AND is_active = TRUE
  `;
  const values = [id];

  const rows = await executeQuery(sql, values, conn);

  return conversionUtils.snakeToCamel(rows[0]);
};

const findByIdAllowNotActive = async (id, conn) => {
  const sql = `
      SELECT *
      FROM member
      WHERE member_id = ?
  `;
  const values = [id];
  const rows = await executeQuery(sql, values, conn);
  return conversionUtils.snakeToCamel(rows[0]);
};

const findByNickname = async (nickname, conn) => {
  const sql = `
      SELECT *
      FROM member
      WHERE nickname = ?
  `;
  const values = [nickname];
  const rows = await executeQuery(sql, values, conn);
  return conversionUtils.snakeToCamel(rows[0]);
};

const findByEmail = async (email, conn) => {
  const sql = `SELECT *
               FROM member
               WHERE email = ?`;
  const values = [email];
  const rows = await executeQuery(sql, values, conn);
  return conversionUtils.snakeToCamel(rows[0]);
};

const findByEmailWithActive = async (email, conn) => {
  const sql = `
      SELECT *
      FROM member
      WHERE email = ?
        AND is_active = TRUE
  `;
  const values = [email];
  const rows = await executeQuery(sql, values, conn);
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
