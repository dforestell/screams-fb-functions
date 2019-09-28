const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream, getScream, commentOnScream } = require('./handlers/screams');

const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');

//scream routes
app.get('/screams', getAllScreams);
app.get('/screams/:screamId', getScream);
app.post('/scream', FBAuth, postOneScream);
app.post('/screams/:screamId/comment', FBAuth, commentOnScream);

// users routes 
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
