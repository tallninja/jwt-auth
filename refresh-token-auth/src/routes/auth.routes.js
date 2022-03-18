const router = require('express').Router();

const {
  signup,
  signin,
  refreshToken,
} = require('../controllers/auth.controller');
const {
  checkUserExist,
  checkRolesExist,
} = require('../middlewares/verifySignup');

router.post('/signin', signin);

router.post('/signup', [checkUserExist, checkRolesExist], signup);

router.get('/refreshToken', refreshToken);

module.exports = router;
