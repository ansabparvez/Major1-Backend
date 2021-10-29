const admin = require("firebase-admin");

const validateFirebaseIdToken = async (req, res, next) => {

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) && !(req.cookies && req.cookies.__session)) {
        console.log("un authorised 1");
        res.status(403).send({"Status": "Unauthorized"});
        return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        // console.log('Found "Authorization" header : '+req.headers.authorization);
        // Read the ID Token from the Authorization header.
        idToken = req.headers.authorization.split('Bearer ')[1];
    } else if (req.cookies) {
        // console.log('Found "__session" cookie');
        // Read the ID Token from cookie.
        idToken = req.cookies.__session;
    } else { // No cookie
        console.log("un authorised 2");
        res.status(403).send({"Status": "Unauthorized"});
        return;
    }

    try {
        console.log("token: "+idToken);
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        // console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        next();
        return;
    } catch (error) { // console.error('Error while verifying Firebase ID token:', error);
        console.log("un authorised 3"+error);
        res.status(403).send({"Status": "Unauthorized"});
        return;
    }
};


//Call this function only if the user is authenticated.
const getUserId = async (request) =>{
    idToken = req.headers.authorization.split('Bearer ')[1];
    const userId = await admin.auth().verifyIdToken(idToken);
    return userId;
}

module.exports = validateFirebaseIdToken;
exports.getUserId = getUserId;