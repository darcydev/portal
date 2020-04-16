const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

var s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: 'ap-southeast-2',
});
const s3Router = express.Router();

s3Router.use('/upload', (req, res) => {
  handleUpload(req.file.path, req.file.filename);
});

const handleUpload = (keyPrefix, filePath) => {
  const fileName = path.basename(filePath);
  const fileStream = fs.createReadStream(filePath);

  console.log('fileName :', fileName);

  const keyName = path.join(keyPrefix, fileName);

  return new Promise((resolve, reject) => {
    fileStream.once('error', reject);

    s3.upload({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: keyName,
      Body: fileStream,
    })
      .promise()
      .then(resolve, reject);
  });
};

module.exports = s3Router;
