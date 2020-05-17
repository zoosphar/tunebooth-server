const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const ObjectID = mongodb.ObjectID;
// const db = require("../../config/keys").mongoURI;
const passport = require("passport");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
aws.config.update({
  accessKeyId: "AKIAQ2FVT7SOOGNSQA4Y",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new aws.S3();

router.post("/video", (req, res) => {
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "tbinputbucket",
      acl: "public-read",
      key: function (req, file, cb) {
        cb(
          null,
          `video/videoFile_${Date.now().toString()}_${file.originalname}`
        );
      },
    }),
  });
  upload.single("video")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Upload Failed!" });
    } else {
      return res.status(207).json({ message: "Upload Success!" });
    }
  });
});

module.exports = router;
