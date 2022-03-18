const { StatusCodes } = require('http-status-codes');

const { User, ROLES } = require('../models');

exports.checkUserExists = (req, res, next) => {
  const { username, email } = req.body;

  // username
  User.findOne({
    username: username,
  }).exec((err, user) => {
    if (err) {
      console.log('Error:', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
      return;
    }
    if (user) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Username is taken !' });
      return;
    }

    // email
    User.findOne({
      email: email,
    }).exec((err, user) => {
      if (err) {
        console.log('Error:', err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
        return;
      }
      if (user) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: 'User already exists !' });
        return;
      }
    });

    next();
  });
};

exports.checkRolesExist = (req, res, next) => {
  if (req.body.roles) {
    const { roles } = req.body;
    roles.map((role) => {
      if (!Object.values(ROLES).includes(role)) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: `${role} role does not exist !` });
        return;
      }
    });
  }
  next();
};
