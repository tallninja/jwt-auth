const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const { auth } = require('../../config/keys');
const { User, Role, ROLES } = require('../models');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ error: 'Authentication required !' });
  }
  jwt.verify(token.split(' ')[1], auth.secret, (err, decodedToken) => {
    if (err) {
      console.log('Error:', err);
      return;
    }
    req.user = decodedToken.id;
    next();
    return;
  });
};

exports.isAdmin = (req, res, next) => {
  User.findById(req.user).exec((err, user) => {
    if (err) {
      console.log('Error:', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          console.log('Error:', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
          return;
        }
        roles.map((role) => {
          if (role.name == ROLES.admin) {
            next();
            return;
          }
        });
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Admin privilleges required !' });
      }
    );
  });
};

exports.isModerator = (req, res, next) => {
  User.findById(req.user).exec((err, user) => {
    if (err) {
      console.log('Error:', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          console.log('Error:', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
          return;
        }
        roles.map((role) => {
          if (role.name == ROLES.moderator) {
            next();
            return;
          }
        });
        return res
          .status(StatusCodes.FORBIDDEN)
          .json({ message: 'Moderator privilleges required !' });
      }
    );
  });
};
