const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  eventPhotoUpload,
  registerForEvent,
  unregisterFromEvent,
  getFeaturedEvents,
  getUpcomingEvents
} = require('../controllers/events');

const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

router.route('/featured').get(getFeaturedEvents);
router.route('/upcoming').get(getUpcomingEvents);

router
  .route('/')
  .get(getEvents)
  .post(protect, authorize('admin', 'librarian'), createEvent);

router
  .route('/:id')
  .get(getEvent)
  .put(protect, authorize('admin', 'librarian'), updateEvent)
  .delete(protect, authorize('admin', 'librarian'), deleteEvent);

router
  .route('/:id/photo')
  .put(protect, authorize('admin', 'librarian'), eventPhotoUpload);

router
  .route('/:id/register')
  .put(protect, registerForEvent);

router
  .route('/:id/unregister')
  .put(protect, unregisterFromEvent);

module.exports = router;