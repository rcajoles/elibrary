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

  newBook.save((err, record) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    User.findById(req.userId).exec((err, creator) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      record.createdBy = creator._id;
      record.save((err, updatedRecord) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.status(200).send({ message: 'A new book was created successfully!' });
      });
    });
  });
};

/**
 * Verify if active user's role is Creator
 * this help's to filter getting list of Books
 */
const isUserViewer = async (params) => {
  try {
    const roles = await Role.find({ _id: { $in: params } });
    let state = false;

    _.forEach(Array.from(roles), (item) => {
      if (item.name === 'viewer') {
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
  const builder = new QueryBuilder(req.query, queryConfig);
  const builtQuery = builder.build();
  let filter = {};

  if (!_.isEmpty(req.query)) {
    filter = {
      ...builtQuery,
    };

    if (_.has(req.query, 'old') || _.has(req.query, 'new')) {
      const recordDuration = new Date();
      let minutes = recordDuration.getMinutes();

      if (_.has(req.query, 'old')) {
        minutes += 10;
      } else if (_.has(req.query, 'new')) {
        minutes -= 10;
      }
      recordDuration.setMinutes(minutes);
      filter.createdAt = { $gte: recordDuration };
    }
  }

  const isViewer = await isUserViewer(req.userRole);
  if (isViewer) {
    filter.createdBy = req.userId;
  }

  try {
    const result = await Book.find(filter).all();

    res.status(200).send({ data: result });
  } catch (error) {
    res.status(500).send({ message: err });
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

  Book.findById(query).exec((err, book) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (book.createdBy != req.userId) {
      res.status(401).send({ message: 'Unauthorized to modify this books.' });
      return;
    }

    book.updateOne(bookUpdate).exec((err, updatedBook) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send({
        message: 'A book record was successfully updated.'
      });
      return;
    });
  });
};

/**
 * Delete a Book record
 */
const deleteRecord = (req, res) => {
  const query = { _id: req.body._id };
  Book.findById(query).exec((err, book) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (book) {
      if (book.createdBy != req.userId) {
        res.status(401).send({ message: 'Unauthorized to modify this books.' });
        return;
      }

      book.deleteOne(book._id, (err, deletedBook) => {
        if (err) {
          res.status(500).send({ message: err });
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
  });
};

const controller = {
  create,
  read,
  update,
  deleteRecord
};

module.exports = controller;
