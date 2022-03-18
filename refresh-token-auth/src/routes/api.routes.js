const router = require('express').Router();

const authRoutes = require('./auth.routes');
const testRoutes = require('./test.routes');

router.use('/auth', authRoutes);

router.use('/test', testRoutes);

module.exports = router;
