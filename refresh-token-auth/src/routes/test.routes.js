const router = require('express').Router();
const { StatusCodes: Sc } = require('http-status-codes');

const {
  verifyToken,
  isModerator,
  isAdmin,
} = require('../middlewares/auth.middleware');

router.get('/all', (req, res) => {
  return res.status(Sc.OK).json({ message: 'All access content !' });
});

router.get('/user', [verifyToken], (req, res) => {
  return res.status(Sc.OK).json({ message: 'User content !' });
});

router.get('/moderator', [verifyToken, isModerator], (req, res) => {
  return res.status(Sc.OK).json({ message: 'Moderator content !' });
});

router.get('/admin', [verifyToken, isAdmin], (req, res) => {
  return res.status(Sc.OK).json({ message: 'Admin content !' });
});

module.exports = router;
