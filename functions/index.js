const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();
const express = require('express');
const app = express();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions


app.get('/screams', (request, response) => {
    admin
        .firestore()
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

    admin.firestore()
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

exports.api = functions.https.onRequest(app);
