const { StatusCodes: Sc } = require('http-status-codes');

const { ROLES, User } = require('../models');

exports.checkUserExist = (req, res, next) => {
  const { username, email } = req.body;

  // username
  User.findOne({
    username: username,
  }).exec((err, user) => {
    if (err) {
      console.log('Error:', err);
      return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    if (user) {
      return res
        .status(Sc.BAD_REQUEST)
        .json({ message: 'Username already taken !' });
    }

    // email
    User.findOne({
      email: email,
    }).exec((err, user) => {
      if (err) {
        console.log('Error:', err);
        return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
      }
      if (user) {
        return res.status(Sc.BAD_REQUEST).json({ message: 'User exists !' });
      }
      next();
      return;
    });
  });
};

exports.checkRolesExist = (req, res, next) => {
  if (req.body.roles) {
    const { roles } = req.body;
    roles.map((role) => {
      if (!Object.values(ROLES).includes(role)) {
        return res
          .status(Sc.BAD_REQUEST)
          .json({ message: `${role} does not exist !` });
      }
    });
    next();
    return;
  }
  next();
};
