const Booking = require('../models/Booking');
const Property = require('../models/Property');

// POST /api/bookings
// Create a booking for authenticated customer
const createBooking = async (req, res) => {
  const customerId = req.user.userId;
  const { propertyId, checkIn, checkOut, guests } = req.body;

  if (!propertyId || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const property = await Property.findOne({ _id: propertyId, isActive: { $ne: false } });
  if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  if (!(inDate instanceof Date && !isNaN(inDate.valueOf())) || !(outDate instanceof Date && !isNaN(outDate.valueOf()))) {
    return res.status(400).json({ success: false, message: 'Invalid dates' });
  }
  const MS = 24 * 60 * 60 * 1000;
  const nights = Math.max(1, Math.ceil((outDate - inDate) / MS));
  const pricePerNight = property.price;
  const taxesAndFees = 25;
  const totalAmount = nights * pricePerNight + taxesAndFees;

  const booking = await Booking.create({
    customer: customerId,
    property: property._id,
    checkIn: inDate,
    checkOut: outDate,
    guests,
    nights,
    pricePerNight,
    taxesAndFees,
    totalAmount,
    status: 'confirmed',
  });

  return res.status(201).json({ success: true, data: booking });
};

// GET /api/bookings/mine
const listMyBookings = async (req, res) => {
  const customerId = req.user.userId;
  const bookings = await Booking.find({ customer: customerId })
    .sort({ createdAt: -1 })
    .populate('property', 'name city country images');
  return res.json({ success: true, data: bookings });
};

module.exports = { createBooking, listMyBookings };
