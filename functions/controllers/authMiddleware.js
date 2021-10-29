const admin = require("firebase-admin");

const validateFirebaseIdToken = async (req, res, next) => {

    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) && !(req.cookies && req.cookies.__session)) {
        res.status(403).send({"success":false,
            "error": "Unauthorized"});
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
        res.status(403).send({"success":false,
            "error": "Unauthorized"});
        return;
    }

    try {
        const decodedIdToken = await admin.auth().verifyIdToken(idToken);
        // console.log('ID Token correctly decoded', decodedIdToken);
        req.user = decodedIdToken;
        next();
        return;
    } catch (error) { // console.error('Error while verifying Firebase ID token:', error);
        res.status(403).send({"success":false,
            "error": "Unauthorized"});
        return;
    }
};

module.exports = validateFirebaseIdToken;
