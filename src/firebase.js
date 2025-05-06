import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, push, set } from 'firebase/database';

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, onValue, push, set };