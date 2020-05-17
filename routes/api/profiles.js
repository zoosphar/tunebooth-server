const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// const validateRegisterInput = require("../../validation/resgisterValidation");

// const User = require("../../models/UserModel");

router.get("/test", (req, res) => {
  res.json({
    msg: "profile works!!"
  });
});

module.exports = router;
