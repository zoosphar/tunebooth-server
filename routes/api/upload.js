const express = require("express");
const router = express.Router();
const mongodb = require("mongodb");
// const db = require("../../config/keys").mongoURI;
const keys = require("../../config/keys");
const fs = require("fs");
const passport = require("passport");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const url = require("url");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

aws.config.update({
  accessKeyId: "AKIAIJZCL3LS4KX2XEQA",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new aws.S3();
const params = {
  url: url.format(
    `${"http://d2ier3jv5q4odo.cloudfront.net"}/${encodeURI("testVideo.mp4")}`
  ),
  expires: Math.floor(Date.now() / 1000) + 120,
};

// @route   POST api/upload/video
// @desc    Upload video route
// @access  Private
router.post("/newVideoPost", (req, res) => {
  const currentTimeStamp = Date.now().toString();
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "tbinputbucket",
      key: function (req, file, cb) {
        console.log(file.originalname);
        cb(null, `video/videoFile_${currentTimeStamp}_${file.originalname}`);
      },
    }),
  });
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Video Upload Failed", err });
    } else {
      return res.status(207).json({ message: "Video Upload Success" });
    }
  });
});

// @route   POST api/upload/audio
// @desc    Upload audio route
// @access  Private
router.post("/newAudioPost", (req, res) => {
  const currentTimeStamp = Date.now().toString();
  const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: "tboutputbucket",
      key: (req, file, cb) => {
        console.log(file.originalname);
        cb(null, `audio/audioFile_${currentTimeStamp}_${file.originalname}`);
      },
    }),
  });
  upload.single("file")(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: "Audio Upload Failed", err });
    } else {
      return res.status(207).json({ message: "Audio Upload Success" });
    }
  });
});

// @route   POST api/upload/image
// @desc    Upload image route
// @access  Private
router.post("/newImagePost", async (req, res) => {
  const currentTimeStamp = Date.now().toString();

  let diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "testAssets/");
    },
    filename: (req, file, cb) => {
      fileName = file.originalname;
      cb(null, file.originalname);
    },
  });

  const uploadLocal = multer({ storage: diskStorage });

  // Compressing images to 30% of their actual size
  await uploadLocal.single("file")(req, res, async (err) => {
    if (err) {
      return res.json({ message: `upload error` });
    } else {
      imagemin([`testAssets/${req.file.originalname}`], {
        destination: "testAssets/compressed/",
        plugins: [
          imageminMozjpeg({
            quality: 25,
          }),
          imageminPngquant({
            quality: [0.3, 0.5],
          }),
        ],
      }).then((file) => {
        req.file.buffer = file[0].data;
        const paramsS3 = {
          Bucket: "tboutputbucket",
          Body: fs.createReadStream(file[0].destinationPath),
          Key: `image/postImage/imageFile_${currentTimeStamp}_${req.file.originalname}`,
        };

        s3.upload(paramsS3, async (err, data) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "Image Upload Failed", err });
          }
          if (data) {
            await unlinkAsync(file[0].destinationPath);
            await unlinkAsync(file[0].sourcePath);
            return res.status(207).json({
              message: `Image Upload Success ${req.file.originalname} - ${data.Location}`,
            });
          }
        });
      });
    }
  });
});

module.exports = router;
