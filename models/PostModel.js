const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    isAttachmentMedia: {
      type: Boolean,
      default: false,
    },
    linkUrl: {
      type: String,
    },
    // This field will contain the link of the CDN provided by storage service
    mediaUrl: {
      type: String,
    },
    mediaThumbUrl: {
      type: String,
    },
    mediaType: {
      type: String,
    },
    category: {
      type: String,
    },
    postType: {
      type: String,
    },
    pollOptions: {
      type: [String],
    },
    totalPolls: {
      type: Number,
    },
    totalRatings: {
      type: Number,
    },
    polling: [
      {
        userID: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        choosedOpts: {
          type: [String],
        },
      },
    ],
    rating: [
      {
        userID: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        rating: {
          type: Number,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = PostModel = mongoose.model("posts", PostSchema);
