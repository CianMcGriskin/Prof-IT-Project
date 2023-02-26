const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const uuid = require('uuid');
const app = express();
const cookieParser = require('cookie-parser');

// Set up body-parser and cors middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB database
mongoose.connect("mongodb+srv://batman:root@cluster0.tjfhrts.mongodb.net/Rosterota?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
}, { collection: "Users" });

const User = mongoose.model("User", userSchema);

// Used to see if user is logged in
const requireLogin = (req, res, next) => {
  const { userCookieAuth } = req.cookies;
  if (!userCookieAuth) {
    return res.redirect('/');
  }
  next();
};

app.get('/timetable', requireLogin, (req, res) => {
  res.send('This is your timetable');
});

// Set up a login API endpoint
app.post("/", (req, res) => {
  const { email, password } = req.body;
  // Check if email exists in the database
  User.findOne({ email }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else if (!user) {
      res.status(400).send("Email not found");
      console.log("Email not found")
    } else {
      // Check if password matches
      if (user.password === password /* && user.status === "Accepted" */) {
        res.cookie('UserAuth', 'AuthTest', { httpOnly: false });
        res.status(200).send("success");
        console.log("Correct password and user is accepted")
      } else if (user.password === password && user.status != "Accepted") {
        res.status(400).send("User not accepted");
        console.log("User not accepted");
      } else {
        res.status(400).send("Wrong password");
        console.log("Wrong password");
      }
    }
  });
});

// Start the server
let port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
