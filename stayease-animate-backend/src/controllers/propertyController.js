const Property = require('../models/Property');
const cloudinary = require('../config/cloudinary');

// Helper to upload base64 or temp file path to Cloudinary
const uploadToCloudinary = async (file, folder = 'properties') => {
  // file can be base64 string (data URL) or file path
  return cloudinary.uploader.upload(file, {
    folder,
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  });
};

// POST /api/properties
// Create property (hotel owner only)
const createProperty = async (req, res) => {
  const ownerId = req.user.userId; // from auth middleware

  const {
    name,
    type,
    description = '',
    address,
    city,
    country,
    zipCode = '',
    phone,
    email,
    website = '',
    rooms,
    price,
    amenities = [],
    // images can be array of base64 data URLs
    images = [],
  } = req.body;

  if (!name || !type || !address || !city || !country || !phone || !email || rooms == null || price == null) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Limit and sanitize images array (max 10)
  const imageInputs = Array.isArray(images) ? images.slice(0, 10) : [];

  const uploadedImages = [];
  for (const img of imageInputs) {
    // Skip empty values
    if (!img) continue;
    const uploaded = await uploadToCloudinary(img, `properties/${ownerId}`);
    uploadedImages.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
  }

  const property = await Property.create({
    owner: ownerId,
    name,
    type,
    description,
    address,
    city,
    country,
    zipCode,
    phone,
    email,
    website,
    rooms,
    price,
    amenities,
    images: uploadedImages,
  });

  return res.status(201).json({ success: true, data: property });
};

// GET /api/properties/mine
const getMyProperties = async (req, res) => {
  const ownerId = req.user.userId;
  const properties = await Property.find({ owner: ownerId }).sort({ createdAt: -1 });
  return res.json({ success: true, data: properties });
};

module.exports = {
  createProperty,
  getMyProperties,
};
