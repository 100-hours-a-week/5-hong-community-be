// https://www.npmjs.com/package/express-mysql-session

const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { mysqlConfig } = require('./database');

// session configuration
const defaultKey = 'defaultKey)_(defaultKeys';

const store = new MySQLStore({
  ...mysqlConfig,
});

const sessionOptions = {
  secret: process.env.SECRET_KEY || defaultKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,  // 1일
  },
  store,
};

module.exports = sessionOptions;
