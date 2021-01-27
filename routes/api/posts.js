const express = require("express");
const router = express.Router();
const passport = require("passport");
const fs = require("fs");
const multer = require("multer");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");
const imageminMozjpeg = require("imagemin-mozjpeg");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

const postValidations = require("../../validation/postValidations.js");

const Post = require("../../models/PostModel");
const Profile = require("../../models/ProfileModel");
const Notif = require("../../models/NotifModel");
const User = require("../../models/UserModel");
const { ObjectID, ObjectId } = require("mongodb");

// aws.config.accessKeyId = "AKIAQ2FVT7SODEKROIE3";
// aws.config.secretAccessKey = "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";
// aws.config.region = "ap-south-1";

aws.config.update({
  accessKeyId: "AKIAQ2FVT7SODEKROIE3",
  secretAccessKey: "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",
  region: "ap-south-1",
});

const s3 = new aws.S3();

// @route   POST api/posts/newVideoImage
// @desc    Upload video post route
// @access  Private
router.post(
  "/newVideoPost",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const currentTimeStamp = Date.now().toString();
    const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: "tbinputbucket",
        key: function (req, file, cb) {
          console.log(file.originalname);
          cb(
            null,
            `video/videoFile_${currentTimeStamp}_${file.originalname
              .split(" ")
              .join("_")}`
          );
        },
      }),
    });
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ msg: "VFailure", err });
      } else {
        const { errors, isValid } = postValidations.postValidation(req.body);
        if (!isValid) {
          return res.status(400).json(errors);
        }
        let postFields = {};
        postFields.user = req.user.id;
        if (req.body.title) postFields.title = req.body.title;
        if (req.body.description) postFields.description = req.body.description;
        if (req.body.isAnonymous === "false") {
          postFields.isAnonymous = false;
        } else if (req.body.isAnonymous === "true") {
          postFields.isAnonymous = true;
        }
        postFields.mediaUrl = `http://d2ier3jv5q4odo.cloudfront.net/video/videoFile_${currentTimeStamp}_${req.file.originalname
          .split(" ")
          .join("_")
          .replace(
            ".mp4",
            ""
          )}/MP4/videoFile_${currentTimeStamp}_${req.file.originalname
          .split(" ")
          .join("_")}`;
        postFields.mediaThumbUrl = `http://d2ier3jv5q4odo.cloudfront.net/video/videoFile_${currentTimeStamp}_${req.file.originalname
          .split(" ")
          .join("_")
          .replace(
            ".mp4",
            ""
          )}/Thumbnails/videoFile_${currentTimeStamp}_${req.file.originalname
          .split(" ")
          .join("_")
          .replace(".mp4", "")}.0000001.jpg`;
        if (req.body.mediaType) postFields.mediaType = req.body.mediaType;
        if (req.body.category) postFields.category = req.body.category;
        if (req.body.postType) postFields.postType = req.body.postType;
        if (req.body.isAttachmentMedia === "false") {
          postFields.isAttachmentMedia = false;
        } else if (req.body.isAttachmentMedia === "true") {
          postFields.isAttachmentMedia = true;
        }
        if (req.body.pollOptions) {
          postFields.pollOptions = req.body.pollOptions.split(",");
        }
        const newPost = new Post(postFields);
        newPost.save().then((post) => {
          return res.status(200).json({
            msg: "post ok",
            post,
          });
        });
      }
    });
  }
);

// @route   POST api/posts/newAudioPost
// @desc    Upload audio post route
// @access  Private
router.post(
  "/newAudioPost",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const currentTimeStamp = Date.now().toString();
    const upload = multer({
      storage: multerS3({
        s3: s3,
        bucket: "tboutputbucket",
        key: (req, file, cb) => {
          console.log(file.originalname);
          cb(
            null,
            `audio/audioFile_${currentTimeStamp}_${file.originalname
              .split(" ")
              .join("_")}`
          );
        },
      }),
    });
    upload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({ msg: "AFailure", err });
      } else {
        const { errors, isValid } = postValidations.postValidation(req.body);
        if (!isValid) {
          return res.status(400).json(errors);
        }
        let postFields = {};
        postFields.user = req.user.id;
        if (req.body.title) postFields.title = req.body.title;
        if (req.body.description) postFields.description = req.body.description;
        if (req.body.isAnonymous === "false") {
          postFields.isAnonymous = false;
        } else if (req.body.isAnonymous === "true") {
          postFields.isAnonymous = true;
        }
        postFields.mediaUrl = `http://d2ier3jv5q4odo.cloudfront.net/audio/audioFile_${currentTimeStamp}_${req.file.originalname
          .split(" ")
          .join("_")}`;
        if (req.body.mediaType) postFields.mediaType = req.body.mediaType;
        if (req.body.category) postFields.category = req.body.category;
        if (req.body.postType) postFields.postType = req.body.postType;
        if (req.body.isAttachmentMedia === "false") {
          postFields.isAttachmentMedia = false;
        } else if (req.body.isAttachmentMedia === "true") {
          postFields.isAttachmentMedia = true;
        }
        if (req.body.pollOptions) {
          postFields.pollOptions = req.body.pollOptions.split(",");
        }

        const newPost = new Post(postFields);
        newPost.save().then((post) => {
          return res.status(200).json({
            msg: "post ok",
            post,
          });
        });
      }
    });
  }
);

// @route   POST api/posts/newImagePost
// @desc    Upload image post route
// @access  Private
router.post(
  "/newImagePost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let diskStorage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "testAssets");
      },
      filename: (req, file, cb) => {
        cb(null, file.originalname);
      },
    });

    const uploadLocal = multer({ storage: diskStorage });

    // Compressing images to 30% of their actual size
    uploadLocal.single("file")(req, res, (err) => {
      if (err) {
        return res.json({ msg: `error` });
      } else {
        // actual flow of route, before that parsing of mulitpart/form-data is done
        const currentTimeStamp = Date.now().toString();

        const { errors, isValid } = postValidations.postValidation(req.body);
        if (!isValid) {
          return res.status(400).json(errors);
        }

        console.log("attached file: ", req.file.originalname);

        imagemin([`testAssets/${req.file.originalname}`], {
          destination: "testAssets/compressed/",
          plugins: [
            imageminMozjpeg({
              quality: 30,
            }),
            imageminPngquant({
              quality: [0.3, 0.5],
            }),
          ],
        }).then((file) => {
          console.log("after compression: ", file);
          req.file.buffer = file[0].data;
          const paramsS3 = {
            Bucket: "tboutputbucket",
            Body: fs.createReadStream(file[0].destinationPath),
            Key: `image/postImage/imageFile_${currentTimeStamp}_${req.file.originalname
              .split(" ")
              .join("_")}`,
          };

          s3.upload(paramsS3, async (err, data) => {
            if (err) {
              console.log("error in uploading post: ", err);
              return res.status(400).json({ msg: "IFailure", err });
            }
            if (data) {
              await unlinkAsync(file[0].destinationPath);
              await unlinkAsync(file[0].sourcePath);
              // File upload successfull, Create post in DB
              let postFields = {};
              postFields.user = req.user.id;
              if (req.body.title) postFields.title = req.body.title;
              if (req.body.description)
                postFields.description = req.body.description;
              if (req.body.isAnonymous === "false") {
                postFields.isAnonymous = false;
              } else if (req.body.isAnonymous === "true") {
                postFields.isAnonymous = true;
              }

              postFields.mediaUrl = `http://d2ier3jv5q4odo.cloudfront.net/image/postImage/imageFile_${currentTimeStamp}_${req.file.originalname
                .split(" ")
                .join("_")}`;
              if (req.body.mediaType) postFields.mediaType = req.body.mediaType;
              if (req.body.category) postFields.category = req.body.category;
              if (req.body.postType) postFields.postType = req.body.postType;
              if (req.body.isAttachmentMedia === "false") {
                postFields.isAttachmentMedia = false;
              } else if (req.body.isAttachmentMedia === "true") {
                postFields.isAttachmentMedia = true;
              }
              if (req.body.pollOptions) {
                postFields.pollOptions = req.body.pollOptions.split(",");
              }

              Post.findOne({ user: ObjectId(req.user.id) }, { createdAt: 1 })
                .sort({ _id: -1 })
                .limit(1)
                .then((result) => {
                  const newPost = new Post(postFields);
                  newPost.save().then((post) => {
                    // if (result !== null) {
                    //   let date1 = new Date(result.createdAt).getTime();
                    //   let date2 = new Date().getTime();
                    //   let dayDiff = Math.floor(
                    //     (date2 - date1) / (1000 * 3600 * 24)
                    //   );
                    //   if (dayDiff >= 7) {
                    //     // posting after a week
                    //     Profile.aggregate([
                    //       { user: ObjectId(req.user.id) },
                    //       {
                    //         $lookup: {
                    //           from: "users",
                    //           localField: "user",
                    //           foreignField: "_id",
                    //           as: "username",
                    //         },
                    //       },
                    //       {
                    //         $unwind: "$username",
                    //       },
                    //       {
                    //         $project: {
                    //           tuneUps: 1,
                    //           "username.username": 1,
                    //           _id: 0,
                    //         },
                    //       },
                    //     ]).then((result1) => {
                    //       let UserIdArr = result1.tuneUps;
                    //       let bulkNotif = [];
                    //       if (UserIdArr.length !== 0) {
                    //         UserIdArr.forEach((item) => {
                    //           let notifData = {};
                    //           notifData.user = item;
                    //           notifData.type = "PBC";
                    //           notifData.postId = ObjectId(post._id);
                    //           notifData.byUsername = result1.username.username;
                    //           bulkNotif.push(notifData);
                    //         });
                    //         console.log("Notif data: ", bulkNotif);
                    //         Notif.insertMany(bulkNotif);
                    //       }
                    //     });
                    //   }
                    // } else {
                    // }
                    return res.status(200).json({
                      msg: "post ok",
                      post,
                    });
                  });
                });
            }
          });
        });
      }
    });
  }
);

// @route   POST api/posts/newLinkPost
// @desc    Upload link post route
// @access  Private
router.post(
  "/newLinkPost",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = postValidations.postValidation(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let postFields = {};
    postFields.user = req.user.id;
    if (req.body.title) postFields.title = req.body.title;
    if (req.body.description) postFields.description = req.body.description;
    if (req.body.isAnonymous === "false") {
      postFields.isAnonymous = false;
    } else if (req.body.isAnonymous === "true") {
      postFields.isAnonymous = true;
    }
    if (req.body.linkUrl) postFields.linkUrl = req.body.linkUrl;
    if (req.body.category) postFields.category = req.body.category;
    if (req.body.postType) postFields.postType = req.body.postType;
    if (req.body.isAttachmentMedia === "false") {
      postFields.isAttachmentMedia = false;
    } else if (req.body.isAttachmentMedia === "true") {
      postFields.isAttachmentMedia = true;
    }
    if (req.body.pollOptions) {
      postFields.pollOptions = req.body.pollOptions.split(",");
    }
    const newPost = new Post(postFields);
    newPost.save().then((post) => {
      return res.status(200).json({
        msg: "post ok",
        post,
      });
    });
  }
);

// @route   POST api/posts/updatePost
// @desc    Update post route (Incomplete)
// @access  Private
router.put(
  "/updatePost",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findOne({ id: req.body.id }).then((post) => {
      if (post) {
        if (req.body.title) post.title = req.body.title;
      }
    });
  }
);

// @route   POST api/posts/getPosts
// @desc    get posts route
// @access  Private
router.post(
  "/getPosts",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = postValidations.getPostValidation(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let postList = {};
    Post.createIndexes([{ "rating.userID": 1 }, { "polling.userID": 1 }]);
    if (req.body.filterTune === "your_tunes") {
      let tuneUps = await Profile.find(
        { _id: req.user.id },
        { tuneUps: 1, _id: 0 }
      );
      tuneUps = tuneUps[0].tuneUps;
      if (req.body.startingId) {
        postList = Post.find({
          $and: [
            { _id: { $in: tuneUps } },
            { _id: { $gt: ObjectId(req.body.startingId) } },
          ],
        })
          .sort({ createdAt: 1 })
          .limit(req.body.fetchLimitCount);
      } else {
        postList = Post.find({ _id: { $in: tuneUps } })
          .sort({ createdAt: 1 })
          .limit(req.body.fetchLimitCount);
      }
    }
    if (req.body.filterTune === "all") {
      let interests = await Profile.find(
        { user: ObjectId(req.user.id) },
        { interests: 1, _id: 0 }
      );
      interests = interests[0].interests;
      if (req.body.startingId) {
        console.log(req.body);
        postList = await Post.aggregate([
          {
            $match: {
              _id: { $lt: ObjectId(req.body.startingId) },
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "username",
            },
          },
          {
            $unwind: "$username",
          },
          {
            $addFields: {
              ratingData: {
                $filter: {
                  input: "$rating",
                  as: "raters",
                  cond: {
                    $and: [{ $eq: ["$$raters.userID", ObjectId(req.user.id)] }],
                  },
                },
              },
              pollingData: {
                $filter: {
                  input: "$polling",
                  as: "pollers",
                  cond: {
                    $and: [
                      { $eq: ["$$pollers.userID", ObjectId(req.user.id)] },
                    ],
                  },
                },
              },
              totalRatings: {
                $size: "$rating",
              },
              totalPollings: {
                $size: "$polling",
              },
            },
          },
          {
            $project: {
              __v: 0,
              rating: 0,
              polling: 0,
              "username.__v": 0,
              "username._id": 0,
              "username.phone": 0,
              "username.email": 0,
              "username.password": 0,
              "username.isPremiumUser": 0,
              "username.type": 0,
              "username.g_id": 0,
              "username.fb_id": 0,
              "username.p_id": 0,
              "username.createdAt": 0,
              "username.updatedAt": 0,
            },
          },
        ])
          .sort({ _id: -1 })
          .limit(Number(req.body.fetchLimitCount));
      } else {
        postList = await Post.aggregate([
          {
            $sort: {
              _id: -1,
            },
          },
          {
            $match: {},
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "username",
            },
          },
          {
            $unwind: "$username",
          },
          {
            $addFields: {
              ratingData: {
                $filter: {
                  input: "$rating",
                  as: "raters",
                  cond: {
                    $and: [{ $eq: ["$$raters.userID", ObjectId(req.user.id)] }],
                  },
                },
              },
              pollingData: {
                $filter: {
                  input: "$polling",
                  as: "pollers",
                  cond: {
                    $and: [
                      { $eq: ["$$pollers.userID", ObjectId(req.user.id)] },
                    ],
                  },
                },
              },
              totalRatings: {
                $size: "$rating",
              },
              totalPollings: {
                $size: "$polling",
              },
            },
          },
          {
            $project: {
              __v: 0,
              rating: 0,
              polling: 0,
              updatedAt: 0,
              "username.__v": 0,
              "username._id": 0,
              "username.phone": 0,
              "username.email": 0,
              "username.password": 0,
              "username.isPremiumUser": 0,
              "username.type": 0,
              "username.g_id": 0,
              "username.fb_id": 0,
              "username.p_id": 0,
              "username.createdAt": 0,
              "username.updatedAt": 0,
            },
          },
        ]).limit(Number(req.body.fetchLimitCount));
      }
    }
    console.log(postList);
    return res.status(200).json(postList);
  }
);

// @route   POST api/posts/getPost
// @desc    get single post route
// @access  Private
router.post(
  "/getSinglePost",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    if (
      req.body.postId.trim() === "" ||
      req.body.postId === null ||
      req.body.postId === undefined
    ) {
      console.log("bad request");
      return res.status(401).json({ msg: "Id required" });
    }
    const post = await Post.aggregate([
      {
        $match: {
          _id: { $eq: ObjectId(req.body.postId) },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "username",
        },
      },
      {
        $unwind: "$username",
      },
      {
        $addFields: {
          ratingData: {
            $filter: {
              input: "$rating",
              as: "raters",
              cond: {
                $and: [{ $eq: ["$$raters.userID", ObjectId(req.user.id)] }],
              },
            },
          },
          pollingData: {
            $filter: {
              input: "$polling",
              as: "pollers",
              cond: {
                $and: [{ $eq: ["$$pollers.userID", ObjectId(req.user.id)] }],
              },
            },
          },
          totalRatings: {
            $size: "$rating",
          },
          totalPollings: {
            $size: "$polling",
          },
        },
      },
      {
        $project: {
          __v: 0,
          rating: 0,
          polling: 0,
          "username.__v": 0,
          "username._id": 0,
          "username.phone": 0,
          "username.email": 0,
          "username.password": 0,
          "username.isPremiumUser": 0,
          "username.type": 0,
          "username.g_id": 0,
          "username.fb_id": 0,
          "username.p_id": 0,
          "username.createdAt": 0,
          "username.updatedAt": 0,
        },
      },
    ]);
    if (post === null) {
      return res.status(404).json({ msg: "Not Found" });
    }
    console.log("fetched single post: ", post);
    return res.status(200).json(post);
  }
);

// @route   POST api/posts/image
// @desc    update the rating/polling
// @access  Private
router.post(
  "/updateFeedback",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = postValidations.updateFeedbackValidation(
      req.body
    );
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let notifData = {};
    Post.findOne(
      {
        _id: ObjectId(req.body.postId),
      },
      { user: 1, _id: 0 }
    ).then((res) => {
      User.findOne({ _id: req.user.id }, { username: 1, _id: 0 }).then(
        (res1) => {
          notifData.user = ObjectId(res.user);
          notifData.byUsername = res1.username;
          notifData.postId = ObjectId(req.body.postId);
        }
      );
    });

    if (req.body.feedbackType === "R") {
      let rating = parseInt(req.body.rating);
      let ratingData = {
        userID: ObjectId(req.user.id),
        rating,
      };
      Post.findOne(
        { _id: ObjectId(req.body.postId) },
        { "rating.userID": ObjectId(req.user.id) }
      ).then((result) => {
        if (result.rating.length !== 0) {
          Post.updateOne(
            {
              _id: ObjectId(req.body.postId),
              "rating.userID": ObjectId(req.user.id),
            },
            { $set: { "rating.$.rating": rating } }
          )
            .then((result) => {
              return res.status(200).json({ msg: "rating ok" });
            })
            .catch((err) => {
              return res.status(500).json(err);
            });
        } else {
          Post.updateOne(
            { _id: ObjectId(req.body.postId) },
            { $push: { rating: ratingData } }
          ).then((result) => {
            // if()
            // Save notification of new rating added
            notifData.type = "PR";
            const notif = new Notif(notifData);
            notif.save().then((result) => {
              return res.status(200).json({
                msg: "ok",
              });
            });
            return res.status(200).json({ msg: "rating ok" });
          });
        }
      });
    }
    if (req.body.feedbackType === "P") {
      let choosedOpts = req.body.choosedOpts.split(",");
      choosedOpts.forEach((item, index) => {
        this[index] = item.trim();
      }, choosedOpts);
      let pollingData = {
        userID: ObjectId(req.user.id),
        choosedOpts,
      };
      Post.findOne(
        { _id: ObjectId(req.body.postId) },
        { "polling.userID": ObjectId(req.user.id) }
      ).then((result) => {
        if (result.polling.length !== 0) {
          Post.updateOne(
            {
              _id: ObjectId(req.body.postId),
              "polling.userID": ObjectId(req.user.id),
            },
            { $set: { "polling.$.choosedOpts": choosedOpts } }
          )
            .then((result) => {
              return res.status(200).json({ msg: "poll ok" });
            })
            .catch((err) => {
              return res.status(500).json(err);
            });
        } else {
          Post.updateOne(
            { _id: ObjectId(req.body.postId) },
            { $push: { polling: pollingData } }
          ).then((result) => {
            // save notification of new polling added
            notifData.type = "PP";
            const notif = new Notif(notifData);
            notif.save().then((result) => {
              return res.status(200).json({
                msg: "ok",
              });
            });
            return res.status(200).json({ msg: "poll ok" });
          });
        }
      });
    }
  }
);

module.exports = router;
