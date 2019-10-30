const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const config = require("../config/couldnary");

cloudinary.config({
  cloud_name: config.cloudinaryName,
  api_key: config.cloudinaryApi,
  api_secret: config.cloudinarySecret
});

const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: "uploadedFiles",
  allowedFormats: ["jpg", "png", "pdf", "doc", "docx"]
});

const parser = multer({
  storage: storage
});

module.exports = {
  parser
};
