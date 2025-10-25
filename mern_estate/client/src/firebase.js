// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-9987d.firebaseapp.com",
  projectId: "mern-estate-9987d",
  storageBucket: "mern-estate-9987d.firebasestorage.app",
  messagingSenderId: "451654899701",
  appId: "1:451654899701:web:32645cf9fbd55c2dc4f2bc",
  measurementId: "G-5JDGPRKNC7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);