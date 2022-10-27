const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

const { Role, presetRoles } = require('./role.model');
db.role = Role;
db.user = require('./user.model');
db.book = require('./book.model');

db.presetRoles = presetRoles;

module.exports = db;
