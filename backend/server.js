const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const app = express();

// Set up body-parser and cors middleware
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());



// Connect to MongoDB database
mongoose.connect(
  "mongodb+srv://batman:root@cluster0.tjfhrts.mongodb.net/Rosterota?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
);

// Schemas of the backend - User collection Schema
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    userID: Number,
    status: { type: String, default: "Pending" },
  },
  { collection: "Users", versionKey: false }
);

// Hours collection Schema
const hoursSchema = new mongoose.Schema({
  schedule: [mongoose.Schema.Types.Mixed],
  userID: Number,
  weekID: String,
},
  { collection: "Hours", versionKey: false });

// ModifyHours collection Schema
const ModifyHoursSchema = new mongoose.Schema(
  {
    schedule: [mongoose.Schema.Types.Mixed],
    userID: Number,
    weekID: String,
  },
  { collection: "ModifyHours", versionKey: false }
);

// RegisterRequests collection Schema
const registerRequestSchema = new mongoose.Schema(
  {
    UserID: Number,
    status: { type: String, default: "Pending" },
    hourlyRate: Number,
  },
  { collection: "RegisterRequests", versionKey: false }
);

// UserInfo collection Schema
const userInfoSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  phoneNumber: String,
  userType: String,
  companyID: Number,
  userID: Number,
}, { collection: "UserInfo", versionKey: false });

// Defining variables using the created schemas
const Users = mongoose.model("User", userSchema);
const Hours = mongoose.model("Hours", hoursSchema);
const RegisterRequests = mongoose.model("RegisterRequests", registerRequestSchema);
const UserInfo = mongoose.model("UserInfo", userInfoSchema);
const ModifyHours = mongoose.model("ModifyHours", ModifyHoursSchema);


// Set up a login API to check the database for user login details
app.post("/", async (req, res) => {
  const { email, password } = req.body;
  // Check if email exists in the database using the inputed data from the user
  Users.findOne({ email }, (err, user) => {
    if (err) 
      console.log("Server Error Occured in / post request");
    else if (!user) 
    console.log("Email Not Found in / post request");
    else {
      // Check if password matches
      if (user.password === password /* && user.status === "Accepted" */){
        res.cookie("UserAuth", "AuthTest", { httpOnly: false });
        res.status(200).send("success");
      } 
      else if (user.password === password && user.status != "Accepted") 
        console.log("User not accepted in / post request");
      else 
        console.log("Wrong password in / post request"); 
    }
  });
});

// Request to retrieve timetable information
app.get("/timetable", async (req, res) => {
  const email = req.cookies.Auth;
  let userID;
  if (!email) {
    console.log("Email cookie is undefined");
    return;
  }

  try {
    // Find userID based on email from cookie
    const user = await Users.findOne({ email: email });
    userID = user.userID;
    console.log(userID);
    // Fetch data from "Hours" collection
    const hours = await Hours.find({ userID: userID });
    // Return data as JSON response
    res.json(hours);
  } catch (err) {
    console.log(err);
  }
});


// Request to retrieve timetable information from a particular timetable weekID
app.get("/timetable/:weekId", async (req, res) => {
  try {
    const weekId = req.params.weekId;
    // Fetch data from "Hours" collection for the specified week
    const timetable = await Hours.findOne({ weekID: weekId });
    if (!timetable) 
      console.log("Timetable not found for the specified week");
    else {
      // Set the response header to json
      res.setHeader("Content-Type", "application/js on");
      res.json(timetable);
    }
  } catch (err) {
    console.log(err);
  }
});

// Two different types of timetable display - this one retrieves all employees timetable information on a particualr week ID
app.get('/manager-timetable', async (req, res) => {
  try {
    // Retrieve the data by joining the UserInfo and Hours collections based on the userID field
    const data = await UserInfo.aggregate([
      {
        $lookup: {
          from: 'Hours',
          localField: 'userID',
          foreignField: 'userID',
          as: 'hours'
        }
      },
      {
        // 1 and 0 represents whether we need those particular values or not
        $project: {
          _id: 0,
          firstName: 1,
          lastName: 1,
          'hours.schedule': 1,
          'hours.weekID': 1
        }
      }
    ]);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

// Post request sent to /api/hours/ - this is used to create and send new data to the timetable for a user and week ID
app.post('/api/hours', async (req, res) => {
  try {
    const { schedule, userID, weekID } = req.body;
    //Check if user already has timetable data for the week selected
    const existingHours = await Hours.findOne({ userID, weekID });
    if (existingHours) 
      return res.status(400).json({ message: 'A timetable with the same week and user ID already exists. Please edit or delete the existing timetable.' });
    
    const hours = new Hours({
      schedule,
      userID,
      weekID,
    });
    //Save hours and respond with new hours as json format
    const savedHours = await hours.save();
    res.json(savedHours);
  } catch (err) {
    console.log(err);
  }
});

// Set up a registration API endpoint to allow users to register to the system
app.post("/register", async (req, res) => {
  const { firstName, surname, email, password, phoneNumber, companyID } = req.body;
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

    res.status(200).send("Success");
  } catch (err) {
    console.log("Server error");
  }
});

// GET request used to find the userID of the current user logged in
app.get('/api/userid', (req, res) => {
  const email = req.cookies.Auth;
  if (!email) {
    console.log("Email cookie is undefined");
    return;
  }

  // Find userID based on email from cookie
  Users.findOne({ email: email }, (err, user) => {
    if (err) 
      console.log(err);
    else 
      res.json(user.userID);
  });
});

// GET user type (Employee/Manager) using cookie email
app.get('/api/usertype', (req, res) => {
  const email = req.cookies.Auth;
  Users.findOne({ email }, (err, user) => {
    if (err) 
      console.log('Error retrieving user ID');
    else {
      const userId = user.userID;
      UserInfo.findOne({ userID: userId }, (err, userInfo) => {
        if (err) 
          console.log(err);
        else {
          const userType = userInfo.userType;
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
    console.log(error);
  }
});

// Get all userInfo
app.get('/api/userinfo', async (req, res) => {
  try {
    const userInfo = await UserInfo.find({}, { _id: 0, __v: 0 });
    res.json(userInfo);
  } catch (error) {
    console.error(error);
  }
});


app.patch('/api/registerRequests/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    // Update Register Request
    const updatedRequest = await RegisterRequests.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRequest) 
      return res.status(404).json({ message: "Register request not found" });
    
    // Update corresponding user
    const updatedUser = await Users.findOneAndUpdate(
      { userID: updatedRequest.UserID },
      { status },
      { new: true }
    );

    if (!updatedUser) 
      return res.status(404).json({ message: "User not found" });
    
     res.json({ updatedRequest, updatedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all timetables and return the information
app.get('/timetables', async (req, res) => {
  try {
    const timetables = await Hours.find();
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching timetables', error });
  }
});

// Update an existing timetable based on the ID of the user
app.put('/timetables/:id', async (req, res) => {
  try {
    const updatedTimetable = await Hours.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTimetable);
  } catch (error) {
    res.status(400).json({ message: 'Error updating timetable', error });
  }
});

//Get modified timetable
app.post("/modify-hours", async (req, res) => {
  try {
    const { schedule, userID, weekID, totalHours } = req.body;
    const modifyHours = new ModifyHours({
      schedule,
      userID,
      weekID,
      totalHours,
    });

    await modifyHours.save();
    res.status(201).json(modifyHours);
  } catch (error) {
    res.status(500).json({ message: "Error saving modified hours", error });
  }
});

// Fetch modification requests
app.get("/modify-hours", async (req, res) => {
  try {
    const modifyHours = await ModifyHours.find().lean();
    const modifyHoursWithUserInfo = [];

    for (const modifyHour of modifyHours) {
      const userInfo = await UserInfo.findOne({ userID: modifyHour.userID }).lean();
      modifyHoursWithUserInfo.push({ ...modifyHour, userInfo });
    }

    res.send(modifyHoursWithUserInfo);
  } catch (error) {
    res.status(500).send({ error: "Error fetching modification requests" });
  }
});

// Delets the hours of a timetable based on user ID
app.delete("/modify-hours/:id", async (req, res) => {
  try {
    const modifyHours = await ModifyHours.findByIdAndDelete(req.params.id);
    if (!modifyHours) 
      return res.status(404).send({ error: "Modification request not found" });
    res.send(modifyHours);
  } catch (error) {
    res.status(500).send({ error: "Error deleting modification request" });
  }
});

// API which copies timetable from one week to the next for a selected user
app.post('/api/copy-timetable', async (req, res) => {
  const { fromWeek, toWeek, selectedUser} = req.body;
  const fromHours = await Hours.findOne({ weekID: fromWeek.value, userID: selectedUser.value}).exec();
  if (!fromHours) {
    console.log("Error");
  }

  const toHours = new Hours({
    schedule: fromHours.schedule,
    userID: selectedUser.value,
    weekID: toWeek.value,
  });

  await toHours.save();
  res.sendStatus(200);
});

// Start the server
let port = 4000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});