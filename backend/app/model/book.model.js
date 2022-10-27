const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const schema = new mongoose.Schema({
  author: String,
  title: String,
  category: String,
  year: String,
  isbn: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  }
}, { timestamps: true });

const Book = mongoose.model('Book', schema);

module.exports = Book;
