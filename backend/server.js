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

app.post("/", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    client.connect(function(err) {
      if (err) {
        console.error(err);
        res.sendStatus(500);
        return;
      }
  
      const db = client.db(dbName);
      const collection = db.collection("Users");
  
      // Find the user with the specified email and password
      collection.findOne({ email: email, password: password }, function(err, user) {
        if (err) {
          console.error(err);
          res.sendStatus(500);
          console.log("Error")
          return;
        }
  
        if (user) {
          // User found, continue with login process
          res.sendStatus(200);
          console.log("Success")
        } else {
          // User not found, send error message
          res.status(401).send("Invalid email or password");
          console.log("Error - not found")
        }
      });
    });
  });

// Start the server
app.listen(port, () => {
    console.log("Server listening on specified port");
  });