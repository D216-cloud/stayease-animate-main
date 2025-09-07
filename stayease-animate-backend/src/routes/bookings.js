const router = require('express').Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { createBooking, listMyBookings } = require('../controllers/bookingController');

// Customer bookings
router.post('/', authMiddleware, roleMiddleware('customer'), createBooking);
router.get('/mine', authMiddleware, roleMiddleware('customer'), listMyBookings);

module.exports = router;
