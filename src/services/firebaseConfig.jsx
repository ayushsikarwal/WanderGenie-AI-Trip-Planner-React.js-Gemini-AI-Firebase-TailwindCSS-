import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8pqSscSLxAUUBoQF2R0giodKXcEIdOPE",
  authDomain: "ai-trip-planner-c1982.firebaseapp.com",
  projectId: "ai-trip-planner-c1982",
  storageBucket: "ai-trip-planner-c1982.firebasestorage.app",
  messagingSenderId: "538476014237",
  appId: "1:538476014237:web:990fe8839258fca7bd8274",
  measurementId: "G-SP5PM1BCDD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);