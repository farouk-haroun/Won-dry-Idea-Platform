import 'dotenv/config';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

// Configure the S3 client
const AWS_REGION = "us-east-1";
const AWS_ACCESS_KEY_ID="AKIATEU4NFIVSDUCTTCA"
const AWS_SECRET_ACCESS_KEY="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"
const S3_BUCKET_NAME="wondry-idea-platform" 
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

async function testS3() {
  try {
    // Use ListBucketsCommand to list S3 buckets
    const result = await s3.send(new ListBucketsCommand({}));
    console.log('S3 Buckets:', result.Buckets);
  } catch (error) {
    console.error('S3 Test Error:', error.message);
  }
}

testS3();
