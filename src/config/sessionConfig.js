const defaultKey = 'defaultKey)_(defaultKeys';

const sessionOptions = {
  secret: process.env.SECRET_KEY || defaultKey,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,  // 1일
  },
};

module.exports = sessionOptions;
