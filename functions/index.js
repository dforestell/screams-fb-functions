const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
const FBAuth = require('./util/fbAuth');

const { getAllScreams, postOneScream } = require('./handlers/screams');

const { signup, login, uploadImage } = require('./handlers/users');

//scream routes
app.get('/screams', getAllScreams);
app.post('/scream', FBAuth, postOneScream);

// users routes 
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);
