const mongoose = require('mongoose');
const { db } = require('../../config/keys');

const { Role, ROLES } = require('./Role');

const init = () => {
  Role.estimatedDocumentCount((err, count) => {
    const roles = Object.values(ROLES);
    if (err) {
      console.log('Error:', err);
    } else {
      if (count < roles.length) {
        Object.values(roles).map(async (role) => {
          await new Role({
            name: role,
          }).save((err) => {
            if (err) {
              console.log('Error:', err);
            } else {
              console.log('Info:', `Created ${role} role.`);
            }
          });
        });
      }
    }
  });
};

const connectDataBase = () => {
  init();
  mongoose.connect(db.MONGO_URI, (err) => {
    if (err) {
      console.log('Error:', err);
    } else {
      console.log('Info:', 'Successfully connected to database !');
    }
  });
};

module.exports = {
  connectDataBase: connectDataBase,
  User: require('./User'),
  Role: Role,
  ROLES: ROLES,
};
