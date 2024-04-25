const defaultAllowedOrigins = ['http://localhost:3000/'];

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',') ||
  defaultAllowedOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) === -1) {
      callback(null, origin);
    } else {
      callback(new Error('CORS 미허용'));
    }
  },
  credentials: true,
};

module.exports = corsOptions;
