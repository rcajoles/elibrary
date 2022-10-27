const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const presetRoles = ['viewer', 'creator'];
exports.presetRoles = presetRoles;

const schema = new mongoose.Schema({
  name: {
    type: String,
    enum: presetRoles
  }
}, { timestamps: true });

const Role = mongoose.model('Role', schema);

exports.Role = Role;
