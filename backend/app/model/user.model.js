const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const schema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role'
    }
  ]
}, { timestamps: true });

const User = mongoose.model('User', schema);

module.exports = User;