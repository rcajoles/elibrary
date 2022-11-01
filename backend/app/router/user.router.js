const { authJwt, verifyBook } = require('../middleware');
// const controller = require('../controllers/user.controller');
const BookController = require('../controllers/book.controller');

module.exports = function(app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });

  app.get('/api/books', [
    authJwt.verifyToken,
    authJwt.isViewer
  ],
    BookController.read
  );

  app.post(
    '/api/books',
    [
      authJwt.verifyToken,
      authJwt.isCreator,
      verifyBook.checkDuplicateBookTitle
    ],
    BookController.create
  );

  app.put(
    '/api/books',
    [
      authJwt.verifyToken,
      authJwt.isCreator,
      verifyBook.checkDuplicateBookTitle
    ],
    BookController.update
  );

  app.post(
    '/api/books/delete',
    [
      authJwt.verifyToken,
      authJwt.isCreator,
      verifyBook.checkDuplicateBookTitle
    ],
    BookController.deleteRecord
  );
};
