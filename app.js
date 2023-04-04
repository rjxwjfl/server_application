const express = require("express");
const app = express();
const mysql = require("mysql2");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const dotenv = require("dotenv");
dotenv.config();

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
  "https://fir-db-af07e-default-rtdb.asia-southeast1.firebasedatabase.app",
};

// Firebase-admin initialize
admin.initializeApp(firebaseConfig);

const messaging = admin.messaging();

// Cloud SQL initialize
const connection = mysql.createConnection({
  host: process.env.DB_ADDRESS,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Cloud SQL connection
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database: " + err.stack);
    return;
  }
  console.log(
    "Connected to database with connection id: " + connection.threadId
  );
});


module.exports ={
  app,
  messaging,
  admin,
  connection
};
