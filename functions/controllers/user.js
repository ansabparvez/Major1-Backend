const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const authMiddleware = require('./authMiddleware');
const uuid = require('uuid')
const nameGenerator = require('./anonymousNameGenerator')

const firestore = admin.firestore();
const userApp = express();
userApp.use(cors({origin: true}));
userApp.use(authMiddleware);

exports.users = functions.https.onRequest(userApp);

userApp.get("*/isRegistrationFinished", async(request, response) => {
    const userId = request.user.uid;
    const userDocument = firestore.doc("Users/"+userId);
    const documentSnapshot = await userDocument.get();
    const status = documentSnapshot.exists;

    var jsonResponse = {
        "success":true,
        "registrationFinished":false
    };

    if(status){
        jsonResponse = {
            "success":true,
            "registrationFinished":true,
            "userData": {...documentSnapshot.data()}
        };
    }

    response.status(201).send(JSON.stringify(jsonResponse));
})

userApp.get("*/isUserNameAvailable", async(request, response) => {
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

userApp.get("*/findUser", async(request, response) => {
    const userName = request.query.userName;
    const usersCollection = firestore.collection("Users/");
    console.log("user name is "+userName)
    const snapShot = await usersCollection.where("userName", '==', userName).get()
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

userApp.get("*/getAnonymousUserData", async(request, response) => {
    const anonymousId = request.query.anonymousId;
    const usersCollection = firestore.collection("Users/");
    const snapShot = await usersCollection.where("anonymousId", '==', anonymousId).get()
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
                "anonymousId":userData.anonymousId,
                "anonymousName":userData.anonymousName
            }
        })
    }

    response.status(201).send(JSON.stringify(jsonResponse));
})

userApp.get("*/deleteUser", async(request, response) => {
    const userId = request.user.uid;
    //const userId = "dgst43bvfsdt43"
    const userDocument = firestore.doc("Users/"+userId);
    

    await userDocument.delete()
    .then((result) => {
        console.log(result)
    })

    const jsonResponse = {
        "success":true,
    };

    response.status(201).send(JSON.stringify({...jsonResponse}));
})

userApp.post("*/completeRegistration", async(request, response) => {
    const userId = request.user.uid;
    //const userId = "dgst43bvfsdt43"
    const userDocument = firestore.doc("Users/"+userId);
    var userData = {...request.body};
    userData.userId = userId;
    userData.anonymousId = uuid.v4().replace(/\-/g,'');
    userData.anonymousName = "Anonymous " + nameGenerator.randomName()

    await userDocument.set(userData);

    const jsonResponse = {
        "success":true,
        "userData":{...userData}
    };

    response.status(201).send(JSON.stringify({...jsonResponse}));
})

userApp.post("*/updateFcmToken", async(request, response) => {
    const userId = request.user.uid;
    //const userId = "dgst43bvfsdt43"
    const userDocument = firestore.doc("Users/"+userId);
    var fcmToken = {fcmToken: request.body.fcmToken}

    await userDocument.update(fcmToken)
    .then((result) => {
        console.log(result)
    })

    const jsonResponse = {
        "success":true,
        "userData":{...fcmToken}
    };

    response.status(201).send(JSON.stringify({...jsonResponse}));
})

userApp.get("*/deleteUser", async(request, response) => {
    const userId = request.user.uid;
    //const userId = "dgst43bvfsdt43"
    const userDocument = firestore.doc("Users/"+userId);
    

    await userDocument.delete()
    .then((result) => {
        console.log(result)
    })

    const jsonResponse = {
        "success":true,
    };

    response.status(201).send(JSON.stringify({...jsonResponse}));
})