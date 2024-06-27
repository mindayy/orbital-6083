var admin = require("firebase-admin");

var serviceAccount = require("/Users/min/Downloads/orbital-6083-firebase-adminsdk-qj4zv-4841409f8f.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://orbital-6083-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.database();