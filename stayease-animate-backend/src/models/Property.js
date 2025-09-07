const mongoose = require('mongoose');

const ImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const PropertySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, enum: ['hotel', 'resort', 'lodge', 'apartment', 'villa'], required: true },
    description: { type: String, default: '' },
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, default: '' },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, default: '' },
    rooms: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    amenities: [{ type: String }],
    images: { type: [ImageSchema], default: [] },
    defaultRoom: {
      name: { type: String, default: '' },
      roomType: { type: String, default: '' },
      capacity: { type: Number, default: 1, min: 1 },
      bedType: { type: String, default: '' },
      size: { type: Number, default: 0, min: 0 }, // in sqm
      smokingAllowed: { type: Boolean, default: false },
      breakfastIncluded: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', PropertySchema);
