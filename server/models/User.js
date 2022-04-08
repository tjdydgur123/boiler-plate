const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

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
    maxlength: 100,
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

// hash the modified or new password before saving into database
userSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (user.isModified("password")) {
    // generate a salt
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      // hash the password using our new salt
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  // plainPassword 12345   encrypted password $2b$10$ZTk.nocpOK7c3yhD1AzPLOgdQovc0F0O2sCvAweBKHTUHK8t.0SPW

  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) {
      return cb(err); // same as cb(err, null)
    }
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;

  // create token by using jsonwebtoken
  // user._id + "secretToken" = token
  // secretToken will give user._id to identify user
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  user.token = token;
  user.save(function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  var user = this;

  // decode the token
  jwt.verify(token, "secretToken", function (err, decoded) {
    // compare the tokens from client and database
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
