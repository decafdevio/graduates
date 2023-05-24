const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  role: {
    type: String,
    default: "participant",
  },
  email: String,
  password: String,
  token: String,
  fname: String,
  sname: String,
  bio: String,
  cv: String,
  github: String,
  linkedin: String,
  portfolio: String,
  available: Boolean,
  location: String,
  picture: String,
});

module.exports.User = mongoose.model("users", userSchema, "users");
