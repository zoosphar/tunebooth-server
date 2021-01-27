const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotifSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    text: {
      type: String,
    },
    type: {
      type: String,
      enum: ["PR", "PP", "PC", "CR", "CRS", "PBC"],
      // Type can be:-
      // Post Rating - PR
      // Post Polling - PP
      // Post Comment - PC
      // Connect Requests - CR
      // Connect Request Accepted - CRA
      // Post By a connection - PBC
    },
    read: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "posts",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    // username by whom the notif generated
    byUsername: {
      type: String,
    },
    commentId: {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
    profileId: {
      type: Schema.Types.ObjectId,
      ref: "profiles",
    },
  },
  { timestamps: true }
);

module.exports = NotifModel = mongoose.model("notifs", NotifSchema);
