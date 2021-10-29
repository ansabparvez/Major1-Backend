const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const authMiddleware = require('./authMiddleware');

const firestore = admin.firestore();
const userApp = express();
userApp.use(cors({origin: true}));
userApp.use(authMiddleware);

exports.users = functions.https.onRequest(userApp);

userApp.get("/isRegistrationFinished", async(request, response) => {
    const userId = request.user.uid;
    const userDocument = firestore.doc("Users/"+userId);
    const status = (await userDocument.get()).exists;

    const jsonResponse = {
        "success":true,
        "registrationFinished":status
    };

    response.status(201).send(JSON.stringify(jsonResponse));

})