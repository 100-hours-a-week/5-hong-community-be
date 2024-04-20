const healthCheck = (req, res, next) => {
  console.log('Health Check');
  res.status(200).send({ message: 'pong' });
};

module.exports = {
  healthCheck,
};
