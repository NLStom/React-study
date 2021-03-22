import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADtCTmq9FB4-fCcPuzFQL8yiVaHTCWBw8",
  authDomain: "react-firebase-917a1.firebaseapp.com",
  projectId: "react-firebase-917a1",
  storageBucket: "react-firebase-917a1.appspot.com",
  messagingSenderId: "374006392431",
  appId: "1:374006392431:web:ef5fe4c0492e439c974f9a",
  //   measurementId: "G-MJE63J53HM",
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUserEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  user = (uid) => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");
}

export default Firebase;
