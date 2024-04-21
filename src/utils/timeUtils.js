const moment = require('moment');

const getCurrentTime = () => {
  const currentDate = new Date();
  return moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
};

module.exports = {
  getCurrentTime,
};
