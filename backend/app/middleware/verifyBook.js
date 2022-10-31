const db = require('../model');
const Book = db.book;

checkDuplicateBookTitle = (req, res, next) => {
  // Book title
  Book.findOne({
    title: req.body.title
  }).exec((err, record1) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (record1 !== null && record1.title) {
      res.status(400).send({ message: 'A book with the same title is already in use!' });
      return;
    }
    next();
  });
};

const verifyBook = {
  checkDuplicateBookTitle
};

module.exports = verifyBook;
