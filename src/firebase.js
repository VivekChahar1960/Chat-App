// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, onValue, push, serverTimestamp } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApn-U8Sy9XWSUk2hYVrfCJKNWas2msDoY",
  authDomain: "superchat-76ef9.firebaseapp.com",
  databaseURL: "https://superchat-76ef9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "superchat-76ef9",
  storageBucket: "superchat-76ef9.firebasestorage.app",
  messagingSenderId: "804358173475",
  appId: "1:804358173475:web:bb2a806e9e9a85591f1296",
  measurementId: "G-99KPVPSFSB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, push, serverTimestamp };