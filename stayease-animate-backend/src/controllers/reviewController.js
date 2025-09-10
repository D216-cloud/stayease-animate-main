const Review = require('../models/Review');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// GET /api/reviews/property/:propertyId
// Get all reviews for a specific property
const getPropertyReviews = async (req, res) => {
  const { propertyId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  try {
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const reviews = await Review.find({
      property: propertyId,
      isVerified: true,
      review: { $ne: '' }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('customer', 'first_name last_name')
    .populate('booking', 'checkIn checkOut');

    const total = await Review.countDocuments({
      property: propertyId,
      isVerified: true,
      review: { $ne: '' }
    });

    const formattedReviews = reviews.map(review => ({
      id: review._id,
      rating: review.rating,
      review: review.review,
      createdAt: review.createdAt,
      customerName: `${review.customer.first_name} ${review.customer.last_name}`,
      bookingDates: {
        checkIn: review.booking.checkIn,
        checkOut: review.booking.checkOut
      },
      helpful: review.helpful,
      reported: review.reported
    }));

    return res.json({
      success: true,
      data: formattedReviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching property reviews:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/reviews/:id
// Get a specific review by ID
const getReviewById = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findById(id)
      .populate('customer', 'first_name last_name')
      .populate('property', 'name')
      .populate('booking', 'checkIn checkOut');

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    return res.json({
      success: true,
      data: {
        id: review._id,
        rating: review.rating,
        review: review.review,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        customerName: `${review.customer.first_name} ${review.customer.last_name}`,
        propertyName: review.property.name,
        bookingDates: {
          checkIn: review.booking.checkIn,
          checkOut: review.booking.checkOut
        },
        isVerified: review.isVerified,
        helpful: review.helpful,
        reported: review.reported
      }
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/reviews/:id
// Update a review (only by the customer who created it)
const updateReview = async (req, res) => {
  const { id } = req.params;
  const customerId = req.user.userId;
  const { rating, review: reviewText } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  try {
    const existingReview = await Review.findById(id);
    if (!existingReview) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (String(existingReview.customer) !== String(customerId)) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    existingReview.rating = rating;
    existingReview.review = reviewText || '';
    await existingReview.save();

    // Update property's average rating
    await updatePropertyRating(existingReview.property);

    return res.json({ success: true, data: existingReview });
  } catch (error) {
    console.error('Error updating review:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/reviews/:id
// Delete a review (by customer or admin)
const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;
  const userRole = req.user.role;

  try {
    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Allow deletion by the review author or admin
    if (String(review.customer) !== String(userId) && userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(id);

    // Update property's average rating
    await updatePropertyRating(review.property);

    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/reviews/:id/helpful
// Mark a review as helpful
const markReviewHelpful = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    return res.json({ success: true, data: { helpful: review.helpful } });
  } catch (error) {
    console.error('Error marking review as helpful:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT /api/reviews/:id/report
// Report a review
const reportReview = async (req, res) => {
  const { id } = req.params;

  try {
    const review = await Review.findByIdAndUpdate(
      id,
      { reported: true },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    return res.json({ success: true, message: 'Review reported successfully' });
  } catch (error) {
    console.error('Error reporting review:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to update property rating
const updatePropertyRating = async (propertyId) => {
  const allReviews = await Review.find({
    property: propertyId,
    isVerified: true
  });

  const totalReviews = allReviews.length;
  const averageRating = totalReviews > 0
    ? allReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
    : 0;

  await Property.findByIdAndUpdate(propertyId, {
    averageRating,
    totalReviews
  });
};

module.exports = {
  getPropertyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  markReviewHelpful,
  reportReview
};
