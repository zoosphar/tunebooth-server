const express = require("express");
const router = express.Router();
const passport = require("passport");



// @route   POST api/profiles/updateInterests
// @desc    update Interest route
// @access  Private
router.post(
    "/getNotifs",
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