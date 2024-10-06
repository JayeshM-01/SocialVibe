// cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: 'daex3gj8h',
  api_key: '958145775471671',
  api_secret: 'xDAo03nnULj6YHAjSEx9aO2HjFw',
});

const storage = new CloudinaryStorage({
  cloudinary,
  folder: 'SocialVibe',
  allowedFormats: ['jpeg', 'png', 'jpg'],
});

module.exports = {
  cloudinary,
  storage,
};
