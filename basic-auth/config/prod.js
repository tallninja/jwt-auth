module.exports = {
  db: {
    MONGO_URI: process.env.MONGO_URI,
  },
  auth: {
    secret: process.env.JWT_SECRET,
    expire: 60 * 60 * 24 * 1, // 1 day
  },
};
