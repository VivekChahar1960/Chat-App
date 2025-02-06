import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, query, where, getDocs, onSnapshot, orderBy, serverTimestamp } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyApn-U8Sy9XWSUk2hYVrfCJKNWas2msDoY",
  authDomain: "superchat-76ef9.firebaseapp.com",
  projectId: "superchat-76ef9",
  storageBucket: "superchat-76ef9.firebasestorage.app",
  messagingSenderId: "804358173475",
  appId: "1:804358173475:web:bb2a806e9e9a85591f1296",
  measurementId: "G-99KPVPSFSB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, collection, addDoc, query, where, getDocs, onSnapshot, orderBy, serverTimestamp };
