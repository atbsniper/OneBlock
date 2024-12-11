import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

export const getStudents = async () => {
  let students = [];
  const querySnapshot = await getDocs(collection(db, "students"));
  querySnapshot.forEach((doc) => {
    students.push(doc.data());
  });
  return students;
};
