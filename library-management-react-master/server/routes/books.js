const express = require('express');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook,
  bookPhotoUpload,
  addReview,
  getFeaturedBooks,
  getNewArrivals
} = require('../controllers/books');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/featured').get(getFeaturedBooks);
router.route('/new-arrivals').get(getNewArrivals);

router
  .route('/')
  .get(getBooks)
  .post(protect, authorize('admin', 'librarian'), createBook);

router
  .route('/:id')
  .get(getBook)
  .put(protect, authorize('admin', 'librarian'), updateBook)
  .delete(protect, authorize('admin', 'librarian'), deleteBook);

router
  .route('/:id/photo')
  .put(protect, authorize('admin', 'librarian'), bookPhotoUpload);

router.route('/:id/reviews').post(protect, addReview);

module.exports = router;