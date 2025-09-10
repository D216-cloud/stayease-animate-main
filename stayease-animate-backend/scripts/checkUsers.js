require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/stayease');
    const owners = await User.find({ role: 'hotel_owner' });
    console.log('Hotel Owners:');
    owners.forEach(owner => {
      console.log(`  Email: ${owner.email}, Name: ${owner.first_name} ${owner.last_name}`);
    });
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkUsers();
