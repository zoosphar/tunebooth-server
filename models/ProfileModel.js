const mongoose = require("mongoose");
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
    connections: [
      {
        userID: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
      },
    ],
    posts: [
      {
        postID: {
          type: Schema.Types.ObjectId,
          ref: "posts",
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = ProfileModel = mongoose.model("profiles", ProfileSchema);
