const mysql = require('mysql2');

const mysqlConfig = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 10,  // 일단 10개의 연결을 설정해둠
  queueLimit: 0,  // 대기열 제한 x
};

const pool = mysql.createPool(mysqlConfig).promise();

// with transaction - command 작업
const command = async (handler) => {
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const result = await handler(conn);

    await conn.commit();
    return result;
  } catch (err) {
    if (conn) await conn.rollback();
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

// without transaction - query 작업
const query = async (sql, values) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const [rows] = await conn.query(sql, values);
    return rows;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  mysqlConfig,
  command,
  query,
};
