const express = require("express");
const app = express();
const { User } = require("./models/User");
const { auth } = require("./middleware/auth");
const config = require("./config/key");
const cookieParser = require("cookie-parser");

// It parses incoming JSON requests and puts the parsed data in req.body
app.use(express.json());
// It recognize the incoming Request Object as strings or arrays
app.use(express.urlencoded({ extended: true }));
// use cookieParser method
app.use(cookieParser());

// connect our express web to MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/hello", (req, res) => {
  res.send("Hello!!!");
});

app.post("/api/users/register", (req, res) => {
  const user = new User(req.body);

  // hash the modified or new password before saving into database -> User.js

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, error });
    return res.status(200).json({ success: true });
  });
});

app.post("/api/users/login", (req, res) => {
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

app.get("/api/users/auth", auth, (req, res) => {
  // if pass the 'auth' middleware function, then Authentication is true!
  // sending below data will be helpful from the client side
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

const port = 4000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
