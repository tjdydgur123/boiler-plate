const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 50,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    // admin -> 1, user -> 0
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    // token expiration date
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
