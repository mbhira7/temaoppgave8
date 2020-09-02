import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/storage"
import "firebase/auth"

var firebaseConfig = {
    apiKey: "AIzaSyB1qYY70HNmHx8elkWvAlP-NoJ-mvd1dmU",
    authDomain: "svelte-eksamen-oppgave.firebaseapp.com",
    databaseURL: "https://svelte-eksamen-oppgave.firebaseio.com",
    projectId: "svelte-eksamen-oppgave",
    storageBucket: "svelte-eksamen-oppgave.appspot.com",
    messagingSenderId: "695766649104",
    appId: "1:695766649104:web:f0bc2a83fc46ce2b3f3d95"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore()
export const storage = firebase.storage()
export const auth = firebase.auth()
export const googleProvider = new firebase.auth.GoogleAuthProvider()