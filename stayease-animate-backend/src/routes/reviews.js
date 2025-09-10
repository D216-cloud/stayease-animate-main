const express = require('express');
const router = express.Router();
const {
  getPropertyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview
} = require('../controllers/reviewController');
const { authenticateToken } = require('../middleware/authMiddleware');

// GET /api/reviews/property/:propertyId - Get reviews for a property
router.get('/property/:propertyId', getPropertyReviews);

// GET /api/reviews/:id - Get a specific review
router.get('/:id', getReviewById);

// PUT /api/reviews/:id - Update a review (customer only)
router.put('/:id', authenticateToken, updateReview);

// DELETE /api/reviews/:id - Delete a review (customer or admin)
router.delete('/:id', authenticateToken, deleteReview);

// PUT /api/reviews/:id/helpful - Mark review as helpful
router.put('/:id/helpful', markReviewHelpful);

// PUT /api/reviews/:id/report - Report a review
router.put('/:id/report', reportReview);

module.exports = router;
