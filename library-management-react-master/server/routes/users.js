const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  userPhotoUpload,
  toggleUserStatus
} = require('../controllers/users');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin'), getUsers)
  .post(protect, authorize('admin'), createUser);

router
  .route('/:id')
  .get(protect, getUser)
  .put(protect, updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.route('/:id/photo').put(protect, userPhotoUpload);

router
  .route('/:id/toggle-status')
  .put(protect, authorize('admin'), toggleUserStatus);

module.exports = router;