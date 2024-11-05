// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "josenicoleno-blog.firebaseapp.com",
  projectId: "josenicoleno-blog",
  storageBucket: "josenicoleno-blog.appspot.com",
  messagingSenderId: "958387750617",
  appId: "1:958387750617:web:ed7d54fe122b9c4b5920c8",
  measurementId: "G-0260457KNB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
