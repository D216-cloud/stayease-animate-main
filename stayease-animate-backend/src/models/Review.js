const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      required: false, // Allow ratings without review text
      trim: true,
      maxlength: 1000, // Limit review text to 1000 characters
      default: '' // Default to empty string if no review provided
    },
    isVerified: {
      type: Boolean,
      default: true // Reviews from completed bookings are verified
    },
    helpful: {
      type: Number,
      default: 0,
      min: 0
    },
    reported: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true // Adds createdAt and updatedAt automatically
  }
);

// Compound index to ensure one review per booking
ReviewSchema.index({ booking: 1 }, { unique: true });

// Index for efficient queries
ReviewSchema.index({ property: 1, createdAt: -1 });
ReviewSchema.index({ customer: 1, createdAt: -1 });

module.exports = mongoose.model('Review', ReviewSchema);
