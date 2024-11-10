// config/gridfs.js
import multer from 'multer';
import { GridFsStorage } from 'multer-gridfs-storage';
import mongoose from 'mongoose';

// MongoDB connection URI
const mongoURI = process.env.MONGO_URI; // Use environment variable or default

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

let gfs;
const conn = mongoose.connection;
conn.once('open', () => {
  // Initialize GridFS bucket
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'uploads',
  });
});

// Configure Multer storage with GridFS
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      filename: file.originalname,
      bucketName: 'uploads', // Collection name in MongoDB
    };
  },
});

export const upload = multer({ storage });
export { gfs }; // Export gfs to use in other files if needed
