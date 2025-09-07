const router = require('express').Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { createBooking, listMyBookings, listOwnerBookings, updateBookingStatus, cancelMyBooking, addReview, ownerRatingsSummary } = require('../controllers/bookingController');

// Customer bookings
router.post('/', authMiddleware, roleMiddleware('customer'), createBooking);
router.get('/mine', authMiddleware, roleMiddleware('customer'), listMyBookings);
router.patch('/:id/cancel', authMiddleware, roleMiddleware('customer'), cancelMyBooking);
router.post('/:id/review', authMiddleware, roleMiddleware('customer'), addReview);

// Owner bookings
router.get('/owner/mine', authMiddleware, roleMiddleware('hotel_owner'), listOwnerBookings);
router.patch('/:id/status', authMiddleware, roleMiddleware('hotel_owner'), updateBookingStatus);
router.get('/owner/ratings', authMiddleware, roleMiddleware('hotel_owner'), ownerRatingsSummary);

module.exports = router;
