// config/upload.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Define the upload path
const uploadPath = path.join('uploads', 'thumbnails');

// Check if the directory exists, and create it if it doesn’t
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer storage for the filesystem
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);  // Store thumbnails in `uploads/thumbnails`
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
export { upload };
