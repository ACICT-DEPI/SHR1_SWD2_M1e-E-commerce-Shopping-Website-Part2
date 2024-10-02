const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary upload photo
const cloudinaryUploadFile = async (fileToUpload) => {
  try {
    const data = await cloudinary.uploader.upload(fileToUpload, {
      resource_type: "auto",
    });
    return data;
  } catch (error) {
    throw new Error("Can't upload file to cloudinary");
  }
};

// Cloudinary remove photo
const cloudinaryRemoveFile = async (filePublicId) => {
  try {
    const result = await cloudinary.uploader.destroy(filePublicId);
    return result;
  } catch (error) {
    throw new Error("Can't remove file from cloudinary");
  }
};

module.exports = { cloudinaryUploadFile, cloudinaryRemoveFile };
