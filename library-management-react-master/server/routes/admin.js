const express = require('express');
const {
  getStats,
  generateReport,
  getLogs,
  updateSettings,
  backupDatabase,
  restoreDatabase
} = require('../controllers/admin');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/stats')
  .get(protect, authorize('admin', 'librarian'), getStats);

router
  .route('/reports/:type')
  .get(protect, authorize('admin', 'librarian'), generateReport);

router
  .route('/logs')
  .get(protect, authorize('admin'), getLogs);

router
  .route('/settings')
  .put(protect, authorize('admin'), updateSettings);

router
  .route('/backup')
  .post(protect, authorize('admin'), backupDatabase);

router
  .route('/restore')
  .post(protect, authorize('admin'), restoreDatabase);

module.exports = router;