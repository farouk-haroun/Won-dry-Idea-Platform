import multer from 'multer';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import s3 from './s3.js';
import { v4 as uuidv4 } from 'uuid';

const AWS_REGION = "us-east-1";
const AWS_ACCESS_KEY_ID="AKIATEU4NFIVSDUCTTCA"
const AWS_SECRET_ACCESS_KEY="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"
const S3_BUCKET_NAME="wondry-idea-platform" 

const storage = multer.memoryStorage(); // Store file in memory for direct upload
const upload = multer({ storage });

const uploadToS3 = async (file) => {
  const fileKey = `uploads/${uuidv4()}-${file.originalname}`;
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
     // Optional: Set this based on your access requirements
  };

  const command = new PutObjectCommand(params);
  await s3.send(command);
  return `https://${S3_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${fileKey}`;
};

export { upload, uploadToS3 };
