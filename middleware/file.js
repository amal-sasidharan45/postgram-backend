const multer = require('multer');
const path = require('path');
const fs = require('fs');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// Define the path to the 'images' folder in the root of the project
const uploadPath = path.join(__dirname, '..', 'images'); // Goes one level up from the current directory

// Create the 'images' directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);

    // Check if the file's MIME type is valid
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, uploadPath); // Use the 'uploadPath' defined above
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    console.log(name);

    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext); // Generate a unique filename
  },
});

module.exports = multer({ storage: storage }).single('image');