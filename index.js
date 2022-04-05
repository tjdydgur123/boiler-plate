const express = require("express");
const app = express();
const port = 4000;

// connect our express web to MongoDB
const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://yonghyuk:ehshd7671@boiler-plate.yuszl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
