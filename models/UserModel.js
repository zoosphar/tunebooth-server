const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create User schema
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
    },
    isPremiumUser: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
    },
    g_id: {
      type: String,
    },
    fb_id: {
      type: String,
    },
    p_id: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = UserModel = mongoose.model("users", UserSchema);
