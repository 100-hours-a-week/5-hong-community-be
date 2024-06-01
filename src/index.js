const express = require('express');
const cors = require('cors');
const session = require('express-session');

const routes = require('./routes');
const corsOptions = require('./config/corsConfig');
const sessionOptions = require('./config/sessionConfig');
const apiPrefix = '/api/v1';

const createApp = () => {
  const app = express();

  app.set('port', process.env.PORT || 8000);
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(session(sessionOptions));
  app.use(apiPrefix, routes);

  app.use('/public/images', express.static('public/images'));

  return app;
};

module.exports = createApp;
