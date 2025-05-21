const express = require('express');
const {
  getCirculations,
  getCirculation,
  issueBook,
  returnBook,
  renewBook,
  getUserCirculations,
  getUserHistory,
  getOverdueBooks
} = require('../controllers/circulation');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin', 'librarian'), getCirculations);

router
  .route('/issue')
  .post(protect, authorize('admin', 'librarian'), issueBook);

router
  .route('/overdue')
  .get(protect, authorize('admin', 'librarian'), getOverdueBooks);

router
  .route('/user/:userId')
  .get(protect, getUserCirculations);

router
  .route('/history/:userId')
  .get(protect, getUserHistory);

router
  .route('/:id')
  .get(protect, getCirculation);

router
  .route('/:id/return')
  .put(protect, authorize('admin', 'librarian'), returnBook);

router
  .route('/:id/renew')
  .put(protect, renewBook);

module.exports = router;