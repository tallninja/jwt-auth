const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

exports.ROLES = {
  admin: 'admin',
  moderator: 'moderator',
  user: 'user',
};

exports.Role = mongoose.model('roles', RoleSchema);
