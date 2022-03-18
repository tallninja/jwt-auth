const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: String,
  roles: [{ type: mongoose.Types.ObjectId, ref: 'roles' }],
});

module.exports = mongoose.model('users', UserSchema);
