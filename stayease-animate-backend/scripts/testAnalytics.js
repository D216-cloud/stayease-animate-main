require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Property = require('../src/models/Property');
const Booking = require('../src/models/Booking');

async function testAnalyticsAPI() {
  try {
    console.log('🔍 Testing Analytics API Data...\n');

    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayease');

    // Find hotel owner
    const owner = await User.findOne({ role: 'hotel_owner' });
    if (!owner) {
      console.log('❌ No hotel owner found in database');
      return;
    }

    console.log(`👤 Hotel Owner: ${owner.first_name} ${owner.last_name} (${owner.email})`);

    // Get properties for this owner
    const properties = await Property.find({ owner: owner._id });
    console.log(`🏨 Properties: ${properties.length}`);
    properties.forEach(p => console.log(`   - ${p.name} (${p.city})`));

    // Get all bookings for these properties
    const propertyIds = properties.map(p => p._id);
    const bookings = await Booking.find({ property: { $in: propertyIds } });

    console.log(`📅 Total Bookings: ${bookings.length}`);

    // Calculate analytics data (same as backend)
    const activeBookings = bookings.filter(b => b.status === 'confirmed').length;
    const totalGuests = bookings.reduce((sum, b) => sum + b.guests, 0);
    const totalRevenue = bookings.filter(b => b.status === 'completed' || b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const totalRooms = properties.reduce((sum, p) => sum + p.rooms, 0);
    const totalNightsBooked = bookings.reduce((sum, b) => sum + b.nights, 0);
    const occupancyRate = totalRooms > 0 ? Math.min(100, (totalNightsBooked / (totalRooms * 30)) * 100) : 0;

    console.log('\n📊 Analytics Data:');
    console.log(`   💰 Total Revenue: $${totalRevenue.toFixed(2)}`);
    console.log(`   👥 Total Guests: ${totalGuests}`);
    console.log(`   📈 Active Bookings: ${activeBookings}`);
    console.log(`   📊 Occupancy Rate: ${occupancyRate.toFixed(1)}%`);
    console.log(`   🏨 Total Properties: ${properties.length}`);

    if (totalGuests > 0) {
      console.log(`   💵 Revenue per Guest: $${(totalRevenue / totalGuests).toFixed(2)}`);
    }

    if (properties.length > 0) {
      console.log(`   🏨 Revenue per Property: $${(totalRevenue / properties.length).toFixed(2)}`);
    }

    console.log('\n✅ Analytics data calculation complete!');
    console.log('This data should appear on the Analytics page at: http://localhost:8080/dashboard/hotel-owner/analytics');

  } catch (error) {
    console.error('❌ Error testing analytics:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testAnalyticsAPI();
