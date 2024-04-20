require('dotenv').config();

const createApp = require('./src');

const startServer = () => {
  const app = createApp();
  const port = process.env.PORT;

  app.listen(port, () => {
    console.log(`Listening on port ${port}`);
  });
};

startServer();
