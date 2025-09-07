const router = require('express').Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const {
	createProperty,
	getMyProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
} = require('../controllers/propertyController');

// Only hotel owners can manage properties
router.post('/', authMiddleware, roleMiddleware('hotel_owner'), createProperty);
router.get('/mine', authMiddleware, roleMiddleware('hotel_owner'), getMyProperties);
router.get('/:id', authMiddleware, roleMiddleware('hotel_owner'), getPropertyById);
router.put('/:id', authMiddleware, roleMiddleware('hotel_owner'), updateProperty);
router.delete('/:id', authMiddleware, roleMiddleware('hotel_owner'), deleteProperty);

module.exports = router;
