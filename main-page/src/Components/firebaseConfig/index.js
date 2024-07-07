import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
const analytics = getAnalytics(app);
const database = getDatabase(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);


export { auth };
export { database };
export { db, storage };
