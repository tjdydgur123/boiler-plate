const express = require("express");
const app = express();
const port = 4000;
const { User } = require("./models/User");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

// application.x-www-form-urlencoded
app.use(express.json());
// will convert the user's input into the JSON format
app.use(express.urlencoded({ extended: true }));
// use cookieParser method
app.use(cookieParser());

// connect our express web to MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, error });
    return res.status(200).json({ success: true });
  });
});

app.post("/login", (req, res) => {
  // find requested email in the database
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    // if the email is existed in the database, check the password is correct
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: "wrong password" });
      }

      // if the password is correct, create the token for user
      user.generateToken((err, user) => {
        if (err) {
          return res.status(400).send(err);
        }

        // save the generated token into cookies
        res
          .cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
