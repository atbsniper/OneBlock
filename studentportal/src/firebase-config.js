// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFt0rjaA2EXpwMk0KyyI01HOKx7JNn2FE",
  authDomain: "oneblock-e3742.firebaseapp.com",
  projectId: "oneblock-e3742",
  storageBucket: "oneblock-e3742.firebasestorage.app",
  messagingSenderId: "531374953707",
  appId: "1:531374953707:web:2c7aa24c05a43ffab39aae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 