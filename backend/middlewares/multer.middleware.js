// Import required modules
const multer = require("multer");
const path = require("path");

// Storage configuration for uploaded files
// multer.diskStorage() is a method provided by Multer to configure where and how uploaded files should be stored on your server’s disk.

// It allows you to: ✅ Define where files should be saved (destination folder).
// ✅ Define how files should be named (custom filenames).


const storage = multer.diskStorage({
  // Set the destination folder for storing uploaded files
  destination: function (req, file, cb) {
    cb(null, "./uploads/"); // All files will be stored in the "uploads" folder
  },

  //cb is a callback function that takes two parameters:1 The first argument (null) means no error. 2 "./uploads/" → The folder where the uploaded file should be stored.

  // Define how the uploaded files are named
  filename: function (req, file, cb) {
    /**
     * Creates a unique filename for each uploaded file:
     * - Date.now() generates a unique timestamp to prevent overwriting files with the same name
     * - path.extname(file.originalname) extracts and appends the original file extension
     * - Example: If a user uploads "profile.jpg", it will be stored as "1679493848230.jpg"
     */
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
  },
});

// File filter to allow only image uploads
const fileFilter = (req, file, cb) => {
  /**
   * Checks the MIME type of the uploaded file.
   * - If the file type starts with "image/", it is accepted.
   * - Otherwise, an error is returned, and the file is rejected.
   */
  if (file.mimetype.startsWith("image/")) {
    //If the file is an image (image/png, image/jpg, etc.), call cb(null, true).
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only images are allowed"), false); // Reject the file with an error message
  }
};

// Initialize a multer instance with storage configuration and file filtering
const upload = multer({ 
  storage: storage, // Use defined storage configuration
  fileFilter: fileFilter // Use file filter to restrict uploads to images only
});

// Export the configured multer instance for use in other parts of the application
module.exports = upload;
