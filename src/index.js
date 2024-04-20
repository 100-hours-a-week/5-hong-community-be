const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const apiPrefix = '/api/v1';

const createApp = () => {
  const app = express();
  app.set('port', process.env.PORT || 8000);
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(apiPrefix, routes);

  return app;
};

module.exports = createApp;
