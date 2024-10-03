const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Function to upload image to Cloudinary
const uploadToCloudinary = async (buffer) => {
  try {
    const result = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${buffer.toString("base64")}`
    );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

// Function to delete image from Cloudinary
const removeFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { uploadToCloudinary, removeFromCloudinary };
