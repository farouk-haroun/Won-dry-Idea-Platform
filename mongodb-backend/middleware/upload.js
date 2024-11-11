import multer from 'multer';
import multerS3 from 'multer-s3';
import s3 from './config/s3.js';

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read', // Optional, use 'private' if you don’t want public access
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + '-' + file.originalname); // File name format
    },
  }),
});

export default upload;
