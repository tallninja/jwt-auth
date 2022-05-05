const router = require('express').Router();
const { StatusCodes } = require('http-status-codes');

const { verifyToken, isAdmin, isModerator } = require('../middlewares/auth');

router.get('/all', (req, res) => {
  res.status(StatusCodes.OK).json({ content: 'All access content' });
});

router.get('/user', [verifyToken], (req, res) => {
  res.status(StatusCodes.OK).json({ content: 'User content' });
});

router.get('/moderator', [verifyToken, isModerator], (req, res) => {
  res.status(StatusCodes.OK).json({ content: 'Moderator Content' });
});

router.get('/admin', [verifyToken, isAdmin], (req, res) => {
  res.status(StatusCodes.OK).json({ content: 'Admin Content' });
});

module.exports = router;
