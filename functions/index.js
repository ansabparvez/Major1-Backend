const functions = require("firebase-functions");
const admin = require("firebase-admin");
var serviceAccount = require("./confedential/serviceAccountKey.json");
admin.initializeApp({
    projectId: "major1-99a4c",
    credential: admin.credential.cert(serviceAccount)
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const user = require('./controllers/user');
const messesing = require('./controllers/messages');
exports.userV1 = user.users; 
exports.messages = messesing.message;
