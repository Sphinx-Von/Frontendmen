// models/User.js


const mongoose = require("mongoose")
mongoose.connect('mongodb://127.0.0.1:27017/nayaapp')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    dp: {
      type: String, // URL or file path to display picture
      default: "",
    },
    posts: [
    ],
  },
);


module.exports = mongoose.model("User", userSchema);

