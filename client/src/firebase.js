// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-blog-410211.firebaseapp.com",
  projectId: "mern-blog-410211",
  storageBucket: "mern-blog-410211.appspot.com",
  messagingSenderId: "232583010876",
  appId: "1:232583010876:web:7902cfd9942c48f8104139"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
