// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import{getFirestore, setDoc, doc} from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
 apiKey: "AIzaSyAjfrq87DU3kD0s2EyoWet4DnOb6V0fP7k",
 authDomain: "orbital-6083.firebaseapp.com",
 databaseURL: "https://orbital-6083-default-rtdb.asia-southeast1.firebasedatabase.app",
 projectId: "orbital-6083",
 storageBucket: "orbital-6083.appspot.com",
 messagingSenderId: "237207599762",
 appId: "1:237207599762:web:d56c32a9ca17fb8c88444b",
 measurementId: "G-4WJC63FRZB"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
