const mongoose = require('mongoose');
const { v4: uuid4 } = require('uuid');

const { auth } = require('../../config/keys');

const RefreshTokenSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
  user: { type: mongoose.Types.ObjectId, ref: 'users', unique: true },
  expires: { type: Date, required: true },
});

RefreshTokenSchema.statics.createToken = async function (user) {
  const existingUserToken = await this.findOne({
    user: user._id,
  }).exec();
  if (!existingUserToken) {
    let expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + auth.jwtRefreshExpiration);
    let _token = uuid4();
    let _object = new this({
      token: _token,
      user: user._id,
      expires: expireAt.getTime(),
    });
    const refreshToken = await _object.save();
    return refreshToken.token;
  }
  return existingUserToken.token;
};

RefreshTokenSchema.statics.verifyTokenExpiration = function (token) {
  return token.expires.getTime() < new Date().getTime();
};

module.exports = mongoose.model('refresh-tokens', RefreshTokenSchema);
