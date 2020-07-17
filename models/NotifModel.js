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
  },
  { timestamps: true }
);

module.exports = NotifModel = mongoose.model("notifs", NotifSchema);
