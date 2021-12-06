const functions = require('firebase-functions')
const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin')
const authMiddleware = require('./authMiddleware');
const uuid = require('uuid')

const firestore = admin.firestore();
const messageApp = express();
messageApp.use(cors({origin: true}));
messageApp.use(authMiddleware);

exports.message = functions.https.onRequest(messageApp);

messageApp.post("/sendMessage", async(request, response) => {
    const body = request.body;
    const receiverId = body.receiverId;
    const snapshot = await firestore.collection("Users").where('userName', '==', receiverId).get();
    var fcmToken;
    snapshot.forEach(doc => {
        fcmToken = doc.data().fcmToken
    });

    const message = {
        data: {
          type: body.type,
          messageId: body.messageId,
          text: body.text,  
          time: body.time,
          userName: body.userName,
          isAnonymous: body.isAnonymous
        },
        token: fcmToken
      };

      var jsonResponse = {};
      
      await admin.messaging().send(message, false)
      .then((response) => {
        jsonResponse = {"success":true}
      })
      .catch((error)=>{
        jsonResponse = {"success":false}
      })   

    response.status(201).send(JSON.stringify({...jsonResponse}));
})