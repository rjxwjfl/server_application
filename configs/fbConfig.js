const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const dotenv = require("dotenv");
dotenv.config();

const firebaseConfig = {
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_URL,
};

admin.initializeApp(firebaseConfig);

const messaging = admin.messaging();

module.exports = messaging;