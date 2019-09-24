const functions = require('firebase-functions');
const admin = require('firebase-admin');
const app = require('express')();
admin.initializeApp();
const firebase = require('firebase');
const db = admin.firestore(); 



const firebaseConfig = {
    apiKey: "AIzaSyAoyTJ0uoZgk8BpJ8t6sDkAwhgfKAfv3gg",
    authDomain: "social-tut-cb2e8.firebaseapp.com",
    databaseURL: "https://social-tut-cb2e8.firebaseio.com",
    projectId: "social-tut-cb2e8",
    storageBucket: "social-tut-cb2e8.appspot.com",
    messagingSenderId: "562821895354",
    appId: "1:562821895354:web:fcb1d1f7adf1a1d4945e83"
  };
firebase.initializeApp(firebaseConfig);


// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


app.get('/screams', (request, response) => {
    db
        .collection('screams')
        .orderBy('createdAt', 'desc')
        .get()
        .then(data => {
            let screams = [];
            data.forEach(doc => {
                screams.push({
                    screamId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
                });
            });
            return response.json(screams)
        })
        .catch((err) => console.error(err))
});

app.post('/scream', (request, response) => {
    if (request.method !== 'POST'){
        return response.status(400).json({ error: "Method not allowed"})
    }
    const newScream = {
        body: request.body.body,
        userHandle: request.body.userHandle,
        createdAt: new Date().toISOString()
    };

    db
        .collection('screams')
        .add(newScream)
        .then(doc => {
            response.json({ message: `document ${doc.id} created successfully` })
        })
        .catch(err => {
            response.status(500).json({error: "something went wrong"});
            console.error(err);
        });
});

const isEmpty = (string) => {
   if (string.trim() === "") return true;
   else return false;
}

const isEmail = (email) => {
    const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email.match(emailRegEx)) return true;
    else return false;
}

app.post('/signup', (request, response) => {
    const newUser = {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword,
        handle: request.body.handle,
    };
    //validate
    let errors = {};
    if(isEmpty(newUser.email)){
        errors.email = "Must not be empty"
    } else if(!isEmail(newUser.email)){ 
        errors.email = "must be a valid email address"
    }

    if(isEmpty(newUser.password)) errors.password = "Must not be empty";
    if(newUser.password !== newUser.confirmPassword) errors.password = "Passwords must match";
    if(isEmpty(newUser.handle)) errors.handle = "Must not be empty";

    if(Object.keys(errors).length > 0 ) return response.status(400).json(errors);

    let userId, token;
    db.doc(`/users/${newUser.handle}`).get()
        .then( doc => {
            if(doc.exists){
                return response.status(400).json({ handle: "this handle is already taken" });
            }else{
                return firebase
                    .auth()
                    .createUserWithEmailAndPassword(newUser.email, newUser.password)
            }
        })
        .then(data => {
            userId = data.user.uid
            return data.user.getIdToken()
        })
        .then(idToken => {
            token = idToken
            const userCredentials = {
                handle: newUser.handle,
                email: newUser.email,
                createdAt: new Date().toISOString(),
                userId 
            }
            return db.doc(`/users/${newUser.handle}`).set(userCredentials);
        })
        .then(() => {
            return response.status(201).json({ token })
        })
        .catch(err => {
            console.error(err);
            if(err.code === "auth/email-already-in-use"){
                return response.status(400).json({ email: "Email is already in use"})
            }else {
                return response.status(500).json({ error: err.code });
            } 
        })
});

exports.api = functions.https.onRequest(app);
