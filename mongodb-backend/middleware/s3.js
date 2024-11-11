import { S3Client } from '@aws-sdk/client-s3';
const AWS_REGION = "us-east-1";
const AWS_ACCESS_KEY_ID="AKIATEU4NFIVSDUCTTCA"
const AWS_SECRET_ACCESS_KEY="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"
const S3_BUCKET_NAME="wondry-idea-platform" 

const s3 = new S3Client({
  region:AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

export default s3;
