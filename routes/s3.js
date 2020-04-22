const express = require('express');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// express.Router() creates a modular, mountable route handlers
const router = express.Router();

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_IAM_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_IAM_SECRET_KEY,
  Bucket: process.env.AWS_S3_BUCKET_NAME,
});

const singleUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        path.basename(file.originalname, path.extname(file.originalname)) +
          '-' +
          Date.now() +
          path.extname(file.originalname)
      );
    },
  }),
  limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
}).single('files');

router.post('/upload', (req, res) => {
  singleUpload(req, res, (error) => {
    console.log('req :>> ', req);
    if (error) res.json({ error: error });
    else {
      if (req.file === undefined) res.json('Error: No File Selected');
      else {
        // If Success
        // Save the file name into database into profile model
        res.json({
          image: req.file.key,
          location: req.file.location,
        });
      }
    }
  });
});

module.exports = router;
