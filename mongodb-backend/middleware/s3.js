import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // From IAM user
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // From IAM user
  region: process.env.AWS_REGION, // Same region as your bucket
});

const s3 = new AWS.S3();
export default s3;
