const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 10,  // 일단 10개의 연결을 설정해둠
  queueLimit: 0,  // 대기열 제한 x
});

module.exports = pool.promise();
