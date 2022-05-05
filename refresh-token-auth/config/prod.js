module.exports = {
  db: {
    MONGO_URI: process.env.MONGO_URI,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: 60 * 60 * 1, // 1 hour
    jwtRefreshExpiration: 60 * 60 * 24 * 1, // 1 day
  },
};
