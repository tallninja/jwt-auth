const router = require('express').Router();

const { signup, signin } = require('../controllers/auth.controller');
const {
  checkUserExist,
  checkRolesExist,
} = require('../middlewares/verifySignup');

router.post('/signin', signin);

router.post('/signup', [checkUserExist, checkRolesExist], signup);

module.exports = router;
