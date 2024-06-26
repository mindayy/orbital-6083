// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBrfmMGYlAlAHdkvh_9_xBb_4-0VcOc6WM",
  authDomain: "orbital-minxin.firebaseapp.com",
  projectId: "orbital-minxin",
  storageBucket: "orbital-minxin.appspot.com",
  messagingSenderId: "441105030437",
  appId: "1:441105030437:web:d1e1161ab4cf5e547b0ecc",
  measurementId: "G-JL5XPJTRW7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };
