const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

exports.ROLES = {
  user: 'user',
  admin: 'admin',
  moderator: 'moderator',
};

exports.Role = mongoose.model('roles', RoleSchema);
