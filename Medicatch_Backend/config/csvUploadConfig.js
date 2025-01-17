const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./csvUploads"); // Save CSV file to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use unique file name
  },
});

// Filter for CSV files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV files are allowed"), false);
  }
};

// Multer upload middleware
const upload = multer({ storage, fileFilter }).single("file"); // Single file upload

module.exports = upload;
