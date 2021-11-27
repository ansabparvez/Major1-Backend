const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const authMiddleware = require('./authMiddleware');
const uuid = require('uuid')

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

userApp.get("/isUserNameAvailable", async(request, response) => {
    const userName = request.query.userName;
    const usersCollection = firestore.collection("Users/");
    console.log("user name is "+userName)
    const snapShot = await usersCollection.where("userName", '==', userName).get()
    var isUserNameAvailable = false;
    if(snapShot.empty){
        console.log("snapshot is empty")
        isUserNameAvailable = true
    }

    const jsonResponse = {
        "success":true,
        "isUserNameAvailable":isUserNameAvailable
    };

    response.status(201).send(JSON.stringify(jsonResponse));
})

userApp.get("/findUser", async(request, response) => {
    const userName = request.query.userName;
    const usersCollection = firestore.collection("Users/");
    console.log("user name is "+userName)
    const snapShot = await usersCollection.where("userName", '==', userName).get()
    var isUserNameAvailable = false;
    var jsonResponse = {};

    if(snapShot.empty){
        jsonResponse = {
            "success":false,
            "error":"No User found with this user name."
        }
    }else{
        snapShot.forEach(doc => {
            console.log(doc.data())
            const userData = doc.data();
            jsonResponse = {
                "success":true,
                "userName":userData.userName,
                "name":userData.name
            }
        })
    }

    response.status(201).send(JSON.stringify(jsonResponse));
})

userApp.post("/completeRegistration", async(request, response) => {
    const userId = request.user.uid;
    //const userId = "dgst43bvfsdt43"
    const userDocument = firestore.doc("Users/"+userId);
    var userData = {...request.body};
    userData.userId = userId;
    userData.anonymousId = uuid.v4().replace(/\-/g,'');

    await userDocument.set(userData);

    const jsonResponse = {
        "success":true
    };

    response.status(201).send(JSON.stringify({...jsonResponse}));
})