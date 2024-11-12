import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // Adjust path if needed

import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

console.log("AWS_REGION:", process.env.AWS_REGION);
console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID ? "Loaded" : "Not Loaded");
console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "Loaded" : "Not Loaded");

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3() {
  try {
    const result = await s3.send(new ListBucketsCommand({}));
    console.log('S3 Buckets:', result.Buckets);
  } catch (error) {
    console.error('S3 Test Error:', error.message);
  }
}

testS3();
