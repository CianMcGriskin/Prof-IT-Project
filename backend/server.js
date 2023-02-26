const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const uuid = require("uuid");
const app = express();
const cookieParser = require("cookie-parser");

// Set up body-parser and cors middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Connect to MongoDB database
mongoose.connect(
  "mongodb+srv://batman:root@cluster0.tjfhrts.mongodb.net/Rosterota?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Schemas of the backend
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
  },
  { collection: "Users" }
);

// Define Mongoose schema
const hoursSchema = new mongoose.Schema({
  schedule: [mongoose.Schema.Types.Mixed],
  userID: String,
  weekID: String,
},
{ collection: "Hours" });

const Users = mongoose.model("User", userSchema);
const Hours = mongoose.model("Hours", hoursSchema);

// Set up a login API endpoint
app.post("/", (req, res) => {
  const { email, password } = req.body;
  // Check if email exists in the database
  Users.findOne({ email }, (err, user) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server error");
    } else if (!user) {
      res.status(400).send("Email not found");
      console.log("Email not found");
    } else {
      // Check if password matches
      if (user.password === password /* && user.status === "Accepted" */) {
        res.cookie("UserAuth", "AuthTest", { httpOnly: false });
        res.status(200).send("success");
        console.log("Correct password and user is accepted");
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

app.get("/timetable", async (req, res) => {
  try {
    // Fetch data from "Hours" collection
    const hours = await Hours.find();
    // Return data as JSON response
    res.json(hours);
    console.log(hours)
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/timetable/:weekId", async (req, res) => {
  try {
    const weekId = req.params.weekId;
    // Fetch data from "Hours" collection for the specified week
    const timetable = await Hours.findOne({ weekID: weekId });
    // Set the response header to "application/json"
    res.setHeader("Content-Type", "application/json");
    // Return data as JSON response
    res.json(timetable);
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Server error");
  }
});




// Start the server
let port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
