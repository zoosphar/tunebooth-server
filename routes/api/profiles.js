const express = require("express");
const router = express.Router();
const passport = require("passport");

// const validateRegisterInput = require("../../validation/resgisterValidation");

const Profile = require("../../models/ProfileModel");
const profileValidations = require("../../validation/profileValidations.js");
const { ObjectId } = require("mongodb");
const UserModel = require("../../models/UserModel");

router.get("/test", (req, res) => {
  res.json({
    msg: "profile works!!",
  });
});

// @route   POST api/profiles/updateInterests
// @desc    update Interest route
// @access  Private
router.post(
  "/updateInterests",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (!profile) {
        // create a profile and populate the interest array
        const newProfile = new Profile({
          user: req.user.id,
          interests: req.body.interests,
        });
        newProfile.save().then((profile1) =>
          res.status(200).json({
            message: "profile created",
            user: profile1.user,
          })
        );
      } else {
        // update the interest array on the existing profile
        profile.interests = req.body.interests;
        profile.save().then((profile1) =>
          res.status(200).json({
            message: "updated profile interests",
          })
        );
      }
    });
  }
);

// @route   POST api/profiles/tuneUp
// @desc    tuneUp with another user route
// @access  Private
router.post(
  "/updateTuneUps",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = profileValidations.tuneUpValidation(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const tuneUpUserId = await UserModel.findOne({
      username: req.body.tuneUser,
    });

    if (req.body.tuneFlag === "up") {
      Profile.findOne({ _id: ObjectId(req.user.id) }).then((user) => {
        if (user.tuneUps.includes(tuneUpUserId)) {
          return res.status(403).json({ message: "user already tuned up" });
        }
        user.tuneUps.push(ObjectId(tuneUpUserId));
        user
          .save()
          .then(() => {
            return res.status(200).json({ message: "user tuned up" });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      });
    }
    if (req.body.tuneFlag === "out") {
      Profile.findOne({ _id: req.user.id }).then((user) => {
        if (user.tuneUps.includes(tuneUpUserId)) {
          return res.status(403).json({ message: "user not tuned up" });
        }
        user.tuneUps.filter((item) => item !== ObjectId(tuneUpUserId));
        user
          .save()
          .then(() => {
            return res.status(200).json({ message: "user tuned out" });
          })
          .catch((err) => {
            return res.status(500).json(err);
          });
      });
    }
  }
);

module.exports = router;
