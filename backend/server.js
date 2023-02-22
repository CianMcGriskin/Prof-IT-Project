// Import the required modules
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');


// Import the MongoClient class from the mongodb library
const MongoClient = require('mongodb').MongoClient;

// Initialize the Express app and set the port
const app = express()
const port = 4000;
const dbName = "Rosterota";

// Connection URI for the MongoDB Atlas cluster
const uri = "mongodb+srv://batman:root@cluster0.tjfhrts.mongodb.net/?retryWrites=true&w=majority";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create a new MongoClient instance
const client = new MongoClient(uri, { useNewUrlParser: true });

client.connect(err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Successfully Connected to MongoDB Atlas")
});

app.post("/", (req, res) => {
  console.log("Post req sent to /")
  const email = req.body.email;
  const password = req.body.password;
  console.log(`Email: ${email} Password: ${password}`)
  
  const collection = client.db('Rosterota').collection('Users');
  // Find the user with the specified email and password
  collection.findOne(
    { email: email, password: password },
    (error, user) => {
    console.log("Entered Findone");
    if (error) {
      console.error(err);
      console.log("Error")
      return;
    } 
    if (user) {
      // User found, continue with login process
      console.log("Success")
    } else {
      // User not found, send error message
      console.log("Error - not found")
    }
  });
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on specified port: ${port}`);
  });