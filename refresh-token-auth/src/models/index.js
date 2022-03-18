const mongoose = require('mongoose');
const { db } = require('../../config/keys');
const { Role, ROLES } = require('./Role');

const createRoles = () => {
  Role.estimatedDocumentCount((err, count) => {
    if (err) {
      console.log('Error:', err);
    } else {
      const roles = Object.values(ROLES);
      if (count < roles.length) {
        roles.map((role) => {
          new Role({
            name: role,
          }).save((err) => {
            if (err) {
              console.log('Error:', err);
            } else {
              console.log('Info:', `Ceated ${role} role`);
            }
          });
        });
      }
    }
  });
};

const dbInit = () => {
  mongoose.connect(db.MONGO_URI, (err) => {
    if (err) {
      console.log('Failed to connect to database !');
      console.log('Error:', err);
    } else {
      console.log('Connected to database !');
      createRoles();
    }
  });
};

module.exports = {
  dbInit: dbInit,
  Role: Role,
  ROLES: ROLES,
  User: require('./User'),
  RefreshToken: require('./RefreshToken'),
};
