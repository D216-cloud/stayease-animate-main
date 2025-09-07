const router = require('express').Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const { createProperty, getMyProperties } = require('../controllers/propertyController');

// Only hotel owners can manage properties
router.post('/', authMiddleware, roleMiddleware('hotel_owner'), createProperty);
router.get('/mine', authMiddleware, roleMiddleware('hotel_owner'), getMyProperties);

module.exports = router;
