const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Role = mongoose.model(
  'Role',
  new mongoose.Schema({
    name: String
  })
);

module.exports = Role;