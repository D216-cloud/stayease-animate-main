const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    nights: { type: Number, required: true, min: 1 },
    pricePerNight: { type: Number, required: true, min: 0 },
    taxesAndFees: { type: Number, required: true, min: 0, default: 25 },
    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'confirmed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
