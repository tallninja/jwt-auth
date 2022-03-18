const Joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { StatusCodes: Sc } = require('http-status-codes');

const { auth } = require('../../config/keys');
const { User, Role, ROLES, RefreshToken } = require('../models');
const bcryptjs = require('bcryptjs');

const SignupSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string(),
  password: Joi.string(),
  roles: Joi.array().optional(),
});

const SigninSchema = Joi.object({
  email: Joi.string(),
  password: Joi.string(),
});

exports.signup = (req, res) => {
  SignupSchema.validateAsync(req.body)
    .then((credentials) => {
      new User({
        username: credentials.username,
        email: credentials.email,
        password: bcrypt.hashSync(credentials.password),
      }).save((err, user) => {
        if (err) {
          console.log('Error:', err);
          return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
        }

        if (credentials.roles) {
          Role.find({
            name: { $in: credentials.roles },
          }).exec((err, roles) => {
            if (err) {
              console.log('Error:', err);
              return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
            }

            user.roles = roles.map((role) => role._id);
            user.save((err) => {
              if (err) {
                console.log('Error:', err);
                return res
                  .status(Sc.INTERNAL_SERVER_ERROR)
                  .json({ error: err });
              }

              return res
                .status(Sc.OK)
                .json({ message: 'Account created successfully !' });
            });
          });
        } else {
          Role.findOne({
            name: ROLES.user,
          }).exec((err, role) => {
            if (err) {
              console.log('Error:', err);
              return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
            }

            user.roles = [role._id];
            user.save((err) => {
              if (err) {
                console.log('Error:', err);
                return res
                  .status(Sc.INTERNAL_SERVER_ERROR)
                  .json({ error: err });
              }

              return res
                .status(Sc.OK)
                .json({ message: 'Account created scuccessfully !' });
            });
          });
        }
      });
    })
    .catch((err) => {
      return res.status(Sc.BAD_REQUEST).json(err);
    });
};

exports.signin = (req, res) => {
  SigninSchema.validateAsync(req.body)
    .then(({ email, password }) => {
      User.findOne({
        email: email,
      })
        .populate('roles')
        .exec(async (err, user) => {
          if (err) {
            console.log('Error:', err);
            return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
          }

          if (!user) {
            return res
              .status(Sc.BAD_REQUEST)
              .json({ message: 'Invalid email !' });
          }

          const passwordIsValid = bcrypt.compareSync(password, user.password);
          if (!passwordIsValid) {
            return res
              .status(Sc.BAD_REQUEST)
              .json({ message: 'Invalid password !' });
          }

          const authorities = user.roles.map(
            (role) => `ROLE_${role.name.toUpperCase()}`
          );

          const token = jwt.sign({ id: user._id }, auth.jwtSecret, {
            expiresIn: auth.jwtExpiration,
          });
          const refreshToken = await RefreshToken.createToken(user);
          const responseData = {
            id: user._id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
          };

          return res.status(Sc.OK).json(responseData);
        });
    })
    .catch((err) => {
      return res.status(Sc.BAD_REQUEST).json(err);
    });
};

exports.refreshToken = (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (!requestToken) {
    return res
      .status(Sc.UNAUTHORIZED)
      .json({ message: 'Refresh token required !' });
  }
  RefreshToken.findOne({
    token: requestToken,
  }).exec((err, refreshToken) => {
    if (err) {
      console.log('Error:', err);
      return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
    }

    if (!refreshToken) {
      return res
        .status(Sc.BAD_REQUEST)
        .json({ message: 'Refresh token does not exits !' });
    }

    if (RefreshToken.verifyTokenExpiration(refreshToken)) {
      RefreshToken.findByIdAndDelete(refreshToken._id).exec((err) => {
        if (err) {
          console.log('Error:', err);
          return res.status(Sc.INTERNAL_SERVER_ERROR).json({ error: err });
        }
        return res
          .status(Sc.UNAUTHORIZED)
          .json({ message: 'Refresh token expired ! please sign in again !' });
      });
    }

    const newAccessToken = jwt.sign({ id: refreshToken.user }, auth.jwtSecret, {
      expiresIn: auth.jwtExpiration,
    });
    return res.status(Sc.OK).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  });
};
