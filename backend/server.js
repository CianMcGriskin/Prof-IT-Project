const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

// Set up body-parser and cors middleware
app.use(bodyParser.json());
app.use(cors());

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
      if (user.password === password) {
        res.status(200).send("Logged in successfully");
      console.log("Correct password")
      } else {
        res.status(400).send("Incorrect password");
      console.log("Wrong password")
      }
    }
  });
});

// Start the server
let port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
