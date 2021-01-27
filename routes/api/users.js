const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

const userValidations = require("../../validation/userValidations.js");

const User = require("../../models/UserModel");

// @route   POST api/users/googleAuth
// @desc    Google login/register
// @access  Public
router.post("/googleAuth", (req, res) => {
  const { errors, isValid } = userValidations.validateGoogleLogin(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // if user don't exists, send createaccountstatus
        User.findOne({ username: req.body.username })
          .then((user) => {
            if (user) {
              errors.username = "Username Already Exists";
              return res.status(400).json({ errors });
            } else {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.g_id, salt, (err, hash) => {
                  if (err) throw err;
                  const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    type: "G",
                    g_id: hash,
                  });
                  newUser
                    .save()
                    .then((user) =>
                      res.json({
                        username: user.username,
                        status: "g_register success",
                      })
                    )
                    .catch((err) => console.log({ err, status: "failure" }));
                });
              });
            }
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ err, message: "Mongo user Error, can't query database" });
          });
      } else {
        if (user.type === "F") {
          errors.email = "fb_acc exists with same email";
          return res.status(400).json({ errors });
        }
        // if google user exists, check g_id
        bcrypt
          .compare(req.body.g_id, user.g_id)
          .then((isMatch) => {
            if (isMatch) {
              // User matched

              // create jwt payload
              const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                tokenDate: Date.now(),
              };

              // sign token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: "14d" },
                (err, token) => {
                  res.json({
                    id: user.id,
                    status: "g_login success",
                    token: "Bearer " + token,
                  });
                }
              );
            } else {
              errors.g_id = "incorrect google id";
              return res.status(400).json({ errors });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      let errors = {};
      errors.db = "Mongo Error, can't query database";
      return res.status(500).json({ errors });
    });
});

// @route   POST api/users/fbAuth
// @desc    Facebook login/register
// @access  Public
router.post("/fbAuth", (req, res) => {
  const { errors, isValid } = userValidations.validateFacebookLogin(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        // if user don't exists, send createaccountstatus
        User.findOne({ username: req.body.username })
          .then((user) => {
            if (user) {
              errors.username = "Username Already Exists";
              return res.status(400).json({ errors });
            } else {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.fb_id, salt, (err, hash) => {
                  if (err) throw err;
                  const newUser = new User({
                    username: req.body.username,
                    email: req.body.email,
                    type: "F",
                    fb_id: hash,
                  });
                  newUser
                    .save()
                    .then((user) =>
                      res.json({
                        username: user.username,
                        status: "fb_register success",
                      })
                    )
                    .catch((err) => console.log({ err, status: "failure" }));
                });
              });
            }
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ err, message: "Mongo user Error, can't query database" });
          });
      } else {
        if (user.type === "G") {
          errors.email = "g_acc exists with same email";
          return res.status(400).json({ errors });
        }
        // if google user exists, check g_id
        bcrypt
          .compare(req.body.fb_id, user.fb_id)
          .then((isMatch) => {
            if (isMatch) {
              // User matched

              // create jwt payload
              const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                tokenDate: Date.now(),
              };

              // sign token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: "14d" },
                (err, token) => {
                  res.json({
                    id: user.id,
                    status: "fb_login success",
                    token: "Bearer " + token,
                  });
                }
              );
            } else {
              errors.fb_id = "incorrect facebook id";
              return res.status(400).json({ errors });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ err, message: "Mongo Error, can't query database" });
    });
});

// @route   POST api/users/phoneAuth
// @desc    Phone login/register
// @access  Public
router.post("/phoneAuthLogin", (req, res) => {
  const { errors, isValid } = userValidations.validatePhoneLogin(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (!user) {
        // if user don't exists, send a 400 status
        return res.status(400).json({ status: "user not exist" });
      } else {
        // if phone user exists, check p_id
        bcrypt
          .compare(req.body.p_id, user.p_id)
          .then((isMatch) => {
            if (isMatch) {
              // User matched

              // create jwt payload
              const payload = {
                id: user.id,
                username: user.username,
                phone: user.phone,
                tokenDate: Date.now(),
              };

              // sign token
              jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: "14d" },
                (err, token) => {
                  res.json({
                    id: user.id,
                    status: "p_login success",
                    token: "Bearer " + token,
                  });
                }
              );
            } else {
              errors.p_id = "incorrect phone id";
              return res.status(400).json({ errors });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ err, message: "Mongo Error, can't query database" });
    });
});

// @route   POST api/users/phoneAuth
// @desc    Phone register
// @access  Public
router.post("/phoneAuthRegister", (req, res) => {
  const { errors, isValid } = userValidations.validatePhoneRegister(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  User.findOne({ phone: req.body.phone })
    .then((user) => {
      if (!user) {
        User.findOne({ username: req.body.username })
          .then((user) => {
            if (user) {
              errors.username = "Username Already Exists";
              return res.status(400).json({ errors });
            } else {
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.p_id, salt, (err, hash) => {
                  if (err) throw err;
                  const newUser = new User({
                    username: req.body.username,
                    phone: req.body.phone,
                    type: "P",
                    p_id: hash,
                  });
                  newUser
                    .save()
                    .then((user) =>
                      res.json({
                        username: user.username,
                        status: "p_register success",
                      })
                    )
                    .catch((err) => console.log({ err, status: "failure" }));
                });
              });
            }
          })
          .catch((err) => {
            return res
              .status(500)
              .json({ err, message: "Mongo user Error, can't query database" });
          });
      } else {
        return res.status(400).json({ status: "user already exists" });
      }
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ status: "request failed, server error", error });
    });
});

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get(
  "/refreshToken",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // const refreshTokenVal = refreshToken(req, res, next);
    return res.json({
      token: req.token ? req.token : null,
    });
  }
);

// // @route   GET api/users/current
// // @desc    Return current user
// // @access  Private
// router.get("/refreshToken", passport.authenticate("jwt", {session: false}), (req, res) => {

// })

module.exports = router;
