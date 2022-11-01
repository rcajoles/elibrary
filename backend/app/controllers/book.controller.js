const queryConfig = require('../config/query.config');
const { QueryBuilder } = require('typeorm-express-query-builder');
const _ = require('lodash');

const db = require('../model');
const User = db.user;
const Role = db.role;
const Book = db.book;

/**
 * Create a book record
 */
const create = (req, res) => {

  try {
    const {
      author,
      title,
      year,
    } = req.body;

     const newBook = new Book({
      author,
      title,
      year,
    });

    newBook.save((error, record) => {
      if (error) {
        res.status(500).send({ message: error });
        return;
      }

      User.findById(req.userId).exec((error, creator) => {
        if (error) {
          res.status(500).send({ message: error });
          return;
        }

        record.createdBy = creator._id;
        record.save((error, updatedRecord) => {
          if (error) {
            res.status(500).send({ message: error });
            return;
          }

          res.status(200).send({ message: 'A new book was created successfully!' });
          return;
        });
      });
    });
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }

};

/**
 * Verify if active user's role is Creator
 * this help's to filter getting list of Books
 */
const userIsCreator = async (params) => {
  try {
    const roles = await Role.find({ _id: { $in: params } });
    let state = false;

    _.forEach(Array.from(roles), (item) => {
            if (item.name === 'viewer' || item.name === 'creator') {
        state = true;
      }
    });

    return state;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Get all Book records
 */
const read = async (req, res) => {
  // const builder = new QueryBuilder(req.query, queryConfig);
  // const builtQuery = builder.build();
  try {
    let filter = {};
    if (!_.isEmpty(req.body)) {

    }

    if (!_.isEmpty(req.query)) {
      filter = {
        ...req.query,
      };

      // get book records were created 10 minutes more or less from now
      if (_.has(req.query, 'old') || _.has(req.query, 'new')) {
        const recordDuration = new Date();
        let minutes = recordDuration.getMinutes();

        if (_.has(req.query, 'old')) {
          minutes += 10;
        } else if (_.has(req.query, 'new')) {
          minutes -= 10;
        }
        recordDuration.setMinutes(minutes);
        if (!_.has(filter, 'data') || _.has(filter, 'data')) {
          filter.data = { createdAt: { $gte: recordDuration } };
        }
      }
    }

    const isViewer = await userIsCreator(req.userRole);

    if (isViewer) {
      if (!_.has(filter, 'data') || _.has(filter, 'data')) {
        filter.data = { createdBy: req.userId };
      }
    }

    Book.find(filter.data).exec((error, record) => {
      if (error) {
        res.status(500).send({ message: error });
        return;
      }

      return res.status(200).send(record);
    });
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }
};

/**
 * Update a Book record
 */
const update = (req, res) => {
   const {
    _id,
    author,
    title,
    year,
  } = req.body;

  const bookUpdate = {
    author,
    title,
    year,
  };

  const query = { _id };

  try {

    Book.findById(query).exec((error, book) => {
      if (error) {
        res.status(500).send({ message: error });
        return;
      }

      if (book.createdBy != req.userId) {
        res.status(401).send({ message: 'Unauthorized to modify this books.' });
        return;
      }

      book.updateOne(bookUpdate).exec((error, updatedBook) => {
        if (error) {
          res.status(500).send({ message: error });
          return;
        }

        res.status(200).send({
          message: 'A book record was successfully updated.'
        });
        return;
      });
    });
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }

};

/**
 * Delete a Book record
 */
const deleteRecord = (req, res) => {
  try {
    const query = { _id: req.body._id };
    Book.findById(query).exec((error, book) => {
      if (error) {
        res.status(500).send({ message: error });
        return;
      }

      if (book) {
        if (book.createdBy != req.userId) {
          res.status(401).send({ message: 'Unauthorized to modify this books.' });
          return;
        }

        book.deleteOne(book._id, (error, deletedBook) => {
          if (error) {
            res.status(500).send({ message: error });
            return;
          }

          res.status(200).send({
            message: 'A book record was successfully deleted.'
          });
          return;
        });
      }

      res.status(200).send({
        message: 'No record of the book was found.'
      });
      return;
    });
  } catch (error) {
    res.status(500).send({ message: error });
    return;
  }

};

const controller = {
  create,
  read,
  update,
  deleteRecord
};

module.exports = controller;
