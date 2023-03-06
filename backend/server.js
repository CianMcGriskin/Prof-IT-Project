const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const app = express();


// Set up body-parser and cors middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());



// Connect to MongoDB database
mongoose.connect(
  "mongodb+srv://batman:root@cluster0.tjfhrts.mongodb.net/Rosterota?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Schemas of the backend
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    userID: Number,
    status: { type: String, default: "Pending" },
  },
  { collection: "Users" , versionKey: false}
);

// Define Mongoose schema
const hoursSchema = new mongoose.Schema({
  schedule: [mongoose.Schema.Types.Mixed],
  userID: Number,
  weekID: String,
},
{ collection: "Hours" , versionKey: false});

const registerRequestSchema = new mongoose.Schema(
  {
    UserID: Number,
    status: { type: String, default: "Pending" },
    hourlyRate: Number,
  },
  { collection: "RegisterRequests", versionKey: false }
);

const userInfoSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  userType: String,
  companyID: Number,
  userID: Number,
}, { collection: "UserInfo" , versionKey: false});


const Users = mongoose.model("User", userSchema);
const Hours = mongoose.model("Hours", hoursSchema);
const RegisterRequests = mongoose.model("RegisterRequests", registerRequestSchema);
const UserInfo = mongoose.model("UserInfo", userInfoSchema);


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
        //res.cookie("UserAuth", "AuthTest", { httpOnly: false });
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
    console.log(weekId)
    const timetable = await Hours.findOne({ weekID: weekId });
    if (!timetable) {
      // Return 404 status code if timetable for the specified week is not found
      res.status(404).send("Timetable not found for the specified week");
    } else {
      // Set the response header to "application/json"
      res.setHeader("Content-Type", "application/json");
      // Return data as JSON response
      res.json(timetable);
      console.log(timetable);
    }
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post('/api/hours', async (req, res) => {
  try {
    const { schedule, userID, weekID } = req.body;
    const hours = new Hours({
      schedule,
      userID,
      weekID,
    });
    const savedHours = await hours.save();
    res.json(savedHours);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Set up a registration API endpoint
app.post("/register", async (req, res) => {
  const {
    firstName,
    surname,
    email,
    password,
    phoneNumber,
    companyID,
  } = req.body;

  try {
    const { hourlyRate } = req.body;
    // Find the latest user ID in the RegisterRequests collection
    const latestRequest = await RegisterRequests.findOne(
      {},
      {},
      { sort: { UserID: -1 } }
    );
    // Generate a new user ID by incrementing the latest ID by 1
    const UserID = latestRequest ? latestRequest.UserID + 1 : 1;
    // Create a new register request with default status "Pending"
    const newRequest = new RegisterRequests({
      UserID,
      status: "Pending",
      hourlyRate: hourlyRate || 12.11,
    });

    const userInfo = new UserInfo({
      firstName,
      lastName: surname,
      phoneNumber,
      userType: "employee",
      companyID,
      userID: UserID,
    });

    const users = new Users({
      status: "Pending",
      email,
      password,
      userID: UserID,
    })
    // Save the new request to the database
    await userInfo.save();
    await newRequest.save();
    await users.save();

    res.status(200).send("success");
    console.log(`New register request saved: ${JSON.stringify(newRequest)}`);
  } catch (err) {
    // Handle error
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get('/api/userid', (req, res) => {
  const email = req.cookies.Auth;
  Users.findOne({ Email: email }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error retrieving user ID');
    } else {
      res.json(user.userID);
    }
  });
});


app.get('/api/usertype', (req, res) => {
  const email = req.cookies.Auth;
  Users.findOne({ Email: email }, (err, user) => {
    if (err) {
      res.status(500).send('Error retrieving user ID');
    } else {
      const userId = user.userID;
      UserInfo.findOne({ UserID: userId }, (err, user) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error retrieving user information');
        } else {
          const userType = user.userType;
          res.json(userType);
        }
      });
    }
  });
});


// GET all register requests
app.get('/api/registerRequests', async (req, res) => {
  try {
    const requests = await RegisterRequests.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch('/api/registerRequests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // Update register request
    const updatedRequest = await RegisterRequests.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Register request not found" });
    }

    // Update user status
    const updatedUser = await Users.findOneAndUpdate(
      { UserID: updatedRequest.UserID },
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ updatedRequest, updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Start the server
let port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
