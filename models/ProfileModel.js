const mongoose = require("mongoose");
const { ObjectID } = require("mongodb");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    fName: {
      type: String,
    },
    lname: {
      type: String,
    },
    bio: {
      type: String,
    },
    profilePic: {
      type: String,
    },
    interests: {
      type: [String],
    },
    totalStars: {
      type: Number,
    },
    tuneUps: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    },
    posts: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "posts" }],
    },
  },
  { timestamps: true }
);

module.exports = ProfileModel = mongoose.model("profiles", ProfileSchema);
