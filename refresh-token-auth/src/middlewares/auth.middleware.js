const { StatusCodes: Sc } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { auth } = require('../../config/keys');
const { User, Role, ROLES } = require('../models');

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res
      .status(Sc.UNAUTHORIZED)
      .json({ message: 'Authentication required !' });
  }
  jwt.verify(token.split(' ')[1], auth.jwtSecret, (err, decodedToken) => {
    if (err) {
      console.log('Error:', err);
      return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    req.userId = decodedToken.id;
    next();
    return;
  });
};

exports.isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      console.log('Error:', err);
      return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    if (user) {
      Role.find({
        _id: { $in: user.roles },
      }).exec((err, roles) => {
        if (err) {
          console.log('Error:', err);
          return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
        }
        for (let role of roles) {
          if (role.name === ROLES.moderator) {
            next();
            return;
          }
        }
        return res
          .status(Sc.UNAUTHORIZED)
          .json({ message: 'Moderator privilleges required !' });
      });
    }
  });
};

exports.isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      console.log('Error:', err);
      return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
    }
    if (user) {
      Role.find({
        _id: { $in: user.roles },
      }).exec((err, roles) => {
        if (err) {
          console.log('Error:', err);
          return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
        }
        for (let role of roles) {
          if (role.name == ROLES.admin) {
            next();
            return;
          }
        }
        return res
          .status(Sc.UNAUTHORIZED)
          .json({ message: 'Admin privilleges required !' });
      });
    }
  });
};
