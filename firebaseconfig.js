import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDMTdBKY7wOM-pR3vEmgYbXUjrU6afwQzE",
  authDomain: "chat-92099.firebaseapp.com",
  projectId: "chat-92099",
  storageBucket: "chat-92099.appspot.com",
  messagingSenderId: "2900382481",
  appId: "1:2900382481:web:0b3e254edea7cb341832b0",
  measurementId: "G-0RBNDWYXBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { auth, db };