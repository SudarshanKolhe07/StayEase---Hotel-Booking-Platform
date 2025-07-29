require('dotenv').config(); // Make sure this line is on top

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Correctly access the values from the .env file
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV',
    allowed_formats: ['jpg', 'png', 'jpeg'], // use allowed_formats not format[]
  },
});

module.exports = {
    cloudinary,
    storage
};
