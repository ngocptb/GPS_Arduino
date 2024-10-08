// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWtCXhF2qoOTSUjDU7s4FiHVG4AusoJtA",
  authDomain: "gps-arduino-b2412.firebaseapp.com",
  databaseURL: "https://gps-arduino-b2412-default-rtdb.firebaseio.com",
  projectId: "gps-arduino-b2412",
  storageBucket: "gps-arduino-b2412.appspot.com",
  messagingSenderId: "802104912991",
  appId: "1:802104912991:web:343ce2a4bc6e1b2d0a7fea",
  measurementId: "G-6799Q0JSW2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase(app); // Get a reference to the Realtime Database

export { db };