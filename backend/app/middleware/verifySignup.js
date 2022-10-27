const db = require('../model');
const presetRoles = db.presetRoles;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: 'Username is already in use!' });
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: 'Email is already in use!' });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!presetRoles.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignup = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
};

module.exports = verifySignup;
