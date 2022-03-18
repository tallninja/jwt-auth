const router = require('express').Router();
const { StatusCodes: SC } = require('http-status-codes');

const apiRoutes = require('./api.routes');

router.get('/', (req, res) => {
  res.status(SC.OK).json({ message: 'JWT authentication with refresh token' });
});

router.use('/api', apiRoutes);

module.exports = router;
