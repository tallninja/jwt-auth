const { StatusCodes: Sc } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { auth } = require('../../config/keys');
const { User, Role, ROLES } = require('../models');

const { TokenExpiredError } = jwt;

const catchTokenError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res
      .status(Sc.UNAUTHORIZED)
      .json({ message: 'Access token is expired !' });
  }
  return res.status(Sc.UNAUTHORIZED).json({ message: 'Unauthorized !' });
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(Sc.UNAUTHORIZED).json({ message: 'No token provided !' });
  }
  jwt.verify(token.split(' ')[1], auth.jwtSecret, (err, decodedToken) => {
    if (err) {
      return catchTokenError(err, res);
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
