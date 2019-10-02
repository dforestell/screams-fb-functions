const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream
} = require("./handlers/screams");

const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
} = require("./handlers/users");

//scream routes
app.get("/screams", getAllScreams);
app.get("/screams/:screamId", getScream);
app.post("/scream", FBAuth, postOneScream);
app.delete("/screams/:screamId", FBAuth, deleteScream);
app.post("/screams/:screamId/comment", FBAuth, commentOnScream);
app.get("/screams/:screamId/like", FBAuth, likeScream);
app.get("/screams/:screamId/unlike", FBAuth, unlikeScream);

// users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/user/:handle", getUserDetails);
app.post("/notifications", FBAuth, markNotificationsRead);

exports.api = functions.https.onRequest(app);
