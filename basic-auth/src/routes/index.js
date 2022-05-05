const router = require('express').Router();

const apiRoutes = require('./api.routes');

// router.use(function (req, res, next) {
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Authorization, Origin, Content-Type, Accept'
//   );
// });

router.get('/', (req, res) => {
  res.status(200).json({ message: 'JWT authentication !' });
});

router.use('/api', apiRoutes);

module.exports = router;
