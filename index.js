// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjfrq87DU3kD0s2EyoWet4DnOb6V0fP7k",
  authDomain: "orbital-6083.firebaseapp.com",
  projectId: "orbital-6083",
  storageBucket: "orbital-6083.appspot.com",
  messagingSenderId: "237207599762",
  appId: "1:237207599762:web:d56c32a9ca17fb8c88444b",
  measurementId: "G-4WJC63FRZB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


async function addClothingItem(item) {
    try {
        const docRef = await addDoc(collection(db, "clothingItems"), {
            title: item.title,
            price: item.price,
            imageUrl: item.imageUrl // If you have image URLs
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

// Example usage
addClothingItem({
    title: "LENA BUTTON WELT POCKET VEST TOP (WHITE)",
    price: "SGD $37.90",
    imageUrl: "https://example.com/image.jpg"
});