const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const { StatusCodes } = require('http-status-codes');

const { auth } = require('../../config/keys');
const { User, Role, ROLES } = require('../models');

const UserSignupSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
  roles: Joi.array().optional(),
});

const UserSigninSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});

exports.signup = (req, res) => {
  UserSignupSchema.validateAsync(req.body)
    .then((signupCredentials) => {
      new User({
        username: signupCredentials.username,
        email: signupCredentials.email,
        password: bcrypt.hashSync(signupCredentials.password, 8),
      }).save((err, user) => {
        if (err) {
          console.log('Error:', err);
          res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
          return;
        }
        if (signupCredentials.roles) {
          Role.find(
            {
              name: { $in: signupCredentials.roles },
            },
            (err, roles) => {
              if (err) {
                console.log('Error:', err);
                res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: err });
                return;
              }
              user.roles = roles.map((role) => role._id);
              user.save((err) => {
                if (err) {
                  console.log('Error:', err);
                  res
                    .status(StatusCodes.INTERNAL_SERVER_ERROR)
                    .json({ error: err });
                  return;
                }
                return res
                  .status(StatusCodes.OK)
                  .json({ message: 'User created successfully !' });
              });
            }
          );
        } else {
          Role.findOne({
            name: ROLES.user,
          }).exec((err, role) => {
            if (err) {
              console.log('Error:', err);
              res
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: err });
              return;
            }
            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                console.log('Error:', err);
                res
                  .status(StatusCodes.INTERNAL_SERVER_ERROR)
                  .json({ error: err });
                return;
              }
              return res
                .status(StatusCodes.OK)
                .json({ message: 'User created successfully !' });
            });
          });
        }
      });
    })
    .catch((err) => {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: err });
    });
};

exports.signin = (req, res) => {
  UserSigninSchema.validateAsync(req.body)
    .then((signinCredentials) => {
      User.findOne({
        email: signinCredentials.email,
      })
        .populate('roles')
        .exec((err, user) => {
          if (err) {
            console.log('Error:', err);
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
            return;
          }
          if (!user) {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ message: 'Account does not exist !' });
          }

          const passwordIsValid = bcrypt.compareSync(
            signinCredentials.password,
            user.password
          );
          if (!passwordIsValid) {
            return res
              .status(StatusCodes.UNAUTHORIZED)
              .json({ accessToken: null, message: 'Invalid Password !' });
          }

          const token = jwt.sign({ id: user._id }, auth.secret, {
            expiresIn: auth.expire,
          });
          let authorities = user.roles.map((role) => {
            return `ROLE_${role.name.toUpperCase()}`;
          });
          return res.status(StatusCodes.OK).json({
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
          });
        });
    })
    .catch((err) => {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: err });
    });
};
