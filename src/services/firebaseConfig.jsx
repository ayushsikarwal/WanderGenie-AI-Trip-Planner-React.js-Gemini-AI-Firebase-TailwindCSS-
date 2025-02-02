import { getFirestore } from "firebase/firestore";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr10mnWK_9TaMX_Y15QrMj5NX0ue0NONo",
  authDomain: "ai-trip-2-77f35.firebaseapp.com",
  projectId: "ai-trip-2-77f35",
  storageBucket: "ai-trip-2-77f35.firebasestorage.app",
  messagingSenderId: "1018946780177",
  appId: "1:1018946780177:web:c691db935e8a23eaa005b0",
  measurementId: "G-SPT3NJ8ZX2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);