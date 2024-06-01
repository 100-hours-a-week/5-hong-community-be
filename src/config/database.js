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
    return await conn.query(sql, values);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
};

/**
 * 제공된 연결 or 풀에서 새 연결을 사용하여 SQL 문 실행
 * @param sql 실행할 SQL 문
 * @param values SQL 문에 삽입할 값의 배열
 * @param conn 데이터베이스 연결 객체, 제공되지 않으면 새 연결을 사용
 * @returns {Promise<*>} 쿼리에 의해 반환된 행들의 배열을 반환하는 Promise 객체
 */
const executeQuery = async (sql, values, conn) => {
  let rows;
  if (conn)
    [rows] = await conn.query(sql, values);
  else
    [rows] = await query(sql, values);
  return rows;
};

module.exports = {
  mysqlConfig,
  command,
  executeQuery,
};
