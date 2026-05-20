const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises; // Use async fs methods
const { cloud_name, api_key, api_secret } = require('./config').get('cloudinary')

cloudinary.config({
  cloud_name,
  api_key,
  api_secret
});

exports.uploadToCloudinary = async function (filePath) {

  try {
    const uploadedImage = await cloudinary.uploader.upload(filePath);

    return uploadedImage.secure_url; 

  } catch (err) {

    throw new Error(`Cloudinary upload failed: ${err.message}`);
    
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (cleanupErr) {
      console.error(`Failed to delete local file at ${filePath}:`, cleanupErr.message);
    }
  }
};