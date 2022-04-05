const express = require("express");
const app = express();
const port = 4000;
const { User } = require("./models/User");
const config = require("./config/key");

//application.x-www-form-urlencoded
app.use(express.json());
//will convert the user's input into the JSON format
app.use(express.urlencoded({ extended: true }));

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
