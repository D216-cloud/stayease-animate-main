const router = require('express').Router();
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');
const {
	createProperty,
	getMyProperties,
	getPropertyById,
	updateProperty,
	deleteProperty,
	listPublicProperties,
	getPublicPropertyById,
  getMyPropertiesWithStats,
} = require('../controllers/propertyController');

// Public listing for customers
router.get('/public', listPublicProperties);
router.get('/public/:id', getPublicPropertyById);

// Only hotel owners can manage properties
router.post('/', authMiddleware, roleMiddleware('hotel_owner'), createProperty);
// Ensure specific 'mine' routes appear before parameterized ':id' to avoid CastErrors
router.get('/mine', authMiddleware, roleMiddleware('hotel_owner'), getMyProperties);
router.get('/mine/with-stats', authMiddleware, roleMiddleware('hotel_owner'), getMyPropertiesWithStats);
router.get('/:id', authMiddleware, roleMiddleware('hotel_owner'), getPropertyById);
router.put('/:id', authMiddleware, roleMiddleware('hotel_owner'), updateProperty);
router.delete('/:id', authMiddleware, roleMiddleware('hotel_owner'), deleteProperty);

module.exports = router;
