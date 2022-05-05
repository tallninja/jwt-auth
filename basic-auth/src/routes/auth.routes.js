const router = require('express').Router();

const { signup, signin } = require('../controllers/auth');
const {
  checkUserExists,
  checkRolesExist,
} = require('../middlewares/verifySignup');

router.post('/signup', [checkUserExists, checkRolesExist], signup);

router.post('/signin', signin);

module.exports = router;
