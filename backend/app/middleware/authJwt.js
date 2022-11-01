const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../model');
const User = db.user;
const Role = db.role;

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, config.secret, async (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;

    const userRole = await User.findById(req.userId).all();
    req.userRole = Array.from(userRole.roles);

    next();
  });
};

const isViewer = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'viewer' || roles[i].name === 'view_all') {
            next();
            return;
          }
        }

        res.status(403).send({ message: 'Require Viewer Role!' });
        return;
      }
    );
  });
};

const isCreator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'creator') {
            return next();
          }
        }

        res.status(403).send({ message: 'Require Creator Role!' });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isViewer,
  isCreator
};

module.exports = authJwt;
