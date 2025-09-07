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
    status: 'pending',
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

// GET /api/bookings/owner/mine
// List bookings for properties owned by the authenticated hotel owner
const listOwnerBookings = async (req, res) => {
  const ownerId = req.user.userId;
  // Find property IDs owned by this user
  const props = await Property.find({ owner: ownerId }, { _id: 1 });
  const propIds = props.map(p => p._id);
  const bookings = await Booking.find({ property: { $in: propIds } })
    .sort({ createdAt: -1 })
    .populate('property', 'name defaultRoom.name')
    .populate('customer', 'first_name last_name email');
  return res.json({ success: true, data: bookings });
};

// PATCH /api/bookings/:id/status
// Update booking status (owner can confirm or cancel) if they own the property
const updateBookingStatus = async (req, res) => {
  const ownerId = req.user.userId;
  const { id } = req.params;
  const { status } = req.body;
  if (!['confirmed', 'cancelled', 'completed', 'pending'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status' });
  }
  const booking = await Booking.findById(id).populate('property', 'owner');
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (!booking.property || String(booking.property.owner) !== String(ownerId)) {
    return res.status(403).json({ success: false, message: 'Not authorized to modify this booking' });
  }
  booking.status = status;
  await booking.save();
  return res.json({ success: true, data: booking });
};

// PATCH /api/bookings/:id/cancel
// Customer cancels their own booking
const cancelMyBooking = async (req, res) => {
  const customerId = req.user.userId;
  const { id } = req.params;

  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (String(booking.customer) !== String(customerId)) {
    return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
  }
  if (booking.status === 'cancelled' || booking.status === 'completed') {
    return res.status(400).json({ success: false, message: `Cannot cancel a ${booking.status} booking` });
  }
  booking.status = 'cancelled';
  await booking.save();
  return res.json({ success: true, data: booking });
};

// POST /api/bookings/:id/review
// Customer leaves a rating and review for their booking
const addReview = async (req, res) => {
  const customerId = req.user.userId;
  const { id } = req.params;
  const { rating, review } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
  }

  const booking = await Booking.findById(id);
  if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
  if (String(booking.customer) !== String(customerId)) {
    return res.status(403).json({ success: false, message: 'Not authorized to review this booking' });
  }
  if (booking.status === 'cancelled') {
    return res.status(400).json({ success: false, message: 'Cannot review a cancelled booking' });
  }

  booking.rating = rating;
  booking.review = review || '';
  booking.reviewedAt = new Date();
  await booking.save();
  return res.json({ success: true, data: booking });
};

// GET /api/bookings/owner/ratings
// Owner ratings summary across their properties
const ownerRatingsSummary = async (req, res) => {
  const ownerId = req.user.userId;
  const props = await Property.find({ owner: ownerId }, { _id: 1 });
  const propIds = props.map(p => p._id);
  if (propIds.length === 0) return res.json({ success: true, averageRating: 0, totalReviews: 0 });
  const bookings = await Booking.find({ property: { $in: propIds }, rating: { $ne: null } }, { rating: 1 });
  const totalReviews = bookings.length;
  const averageRating = totalReviews ? (bookings.reduce((sum, b) => sum + (b.rating || 0), 0) / totalReviews) : 0;
  return res.json({ success: true, averageRating, totalReviews });
};

// GET /api/dashboard/owner/stats
// Get dashboard stats for the authenticated hotel owner
const getOwnerDashboardStats = async (req, res) => {
  const ownerId = req.user.userId;

  // Get properties for the owner
  const properties = await Property.find({ owner: ownerId });
  const propertyIds = properties.map(p => p._id);
  const totalProperties = properties.length;

  if (propertyIds.length === 0) {
    return res.json({
      success: true,
      data: {
        totalProperties: 0,
        activeBookings: 0,
        totalGuests: 0,
        totalRevenue: 0,
        occupancyRate: 0,
        recentBookings: [],
      },
    });
  }

  // Get all bookings for these properties
  const bookings = await Booking.find({ property: { $in: propertyIds } });

  const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalGuests = bookings.reduce((sum, b) => sum + b.guests, 0);
  const totalRevenue = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed').reduce((sum, b) => sum + b.totalAmount, 0);

  // For a simple occupancy rate, we can consider total nights booked vs total rooms * days.
  // This is a simplification. A real-world scenario would be more complex.
  const totalNightsBooked = bookings.reduce((sum, b) => sum + b.nights, 0);
  const totalRooms = properties.reduce((sum, p) => sum + p.rooms, 0);
  // Assuming a 30-day window for simplicity
  const occupancyRate = totalRooms > 0 ? Math.min(100, (totalNightsBooked / (totalRooms * 30)) * 100) : 0;

  const recentBookings = await Booking.find({ property: { $in: propertyIds } })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('customer', 'fullName')
    .populate('property', 'name');

  return res.json({
    success: true,
    data: {
      totalProperties,
      activeBookings,
      totalGuests,
      totalRevenue: totalRevenue.toFixed(2),
      occupancyRate: occupancyRate.toFixed(0),
      recentBookings,
    },
  });
};

module.exports = {
  createBooking,
  listMyBookings,
  listOwnerBookings,
  updateBookingStatus,
  cancelMyBooking,
  addReview,
  ownerRatingsSummary,
  getOwnerDashboardStats,
};
