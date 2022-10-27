const db = require('../model');
const Book = db.book;

checkDuplicateBookTitleOrISBN = (req, res, next) => {
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

    // Book isbn
    Book.findOne({
      isbn: req.body.isbn
    }).exec((err, record2) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (req.method !== 'PUT') {
        if (record2 !== null && record2.isbn) {
          res.status(400).send({ message: 'A book with the same ISBN is already in use!' });
          return;
        }
      }

      next();
    });
  });
};

const verifyBook = {
  checkDuplicateBookTitleOrISBN
};

module.exports = verifyBook;
