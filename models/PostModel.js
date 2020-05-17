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
    link: {
      type: String,
    },
    linkSrc: {
      type: String,
    },
    // This field will contain the link of the CDN provided by storage service
    mediaName: {
      type: String,
    },
    mediaUrl: {
      type: String,
    },
    mediaType: {
      type: String,
    },
    categories: {
      type: String,
      required: true,
    },
    pollOptions: [
      {
        optID: {
          type: Number,
        },
        optVal: {
          type: "Text",
        },
      },
    ],
    polling: [
      {
        userID: {
          type: Schema.Types.ObjectId,
          ref: "users",
        },
        choosedOpts: [
          {
            optID: {
              type: Number,
            },
            optVal: {
              type: "Text",
            },
          },
        ],
        time: {
          type: String,
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
        time: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = PostModel = mongoose.model("posts", PostSchema);
