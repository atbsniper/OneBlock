
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFKckBRbm7nNyHlGIyCecxNw0xlXfJbtU",
  authDomain: "oneblock-73d43.firebaseapp.com",
  projectId: "oneblock-73d43",
  storageBucket: "oneblock-73d43.appspot.com",
  messagingSenderId: "171679226330",
  appId: "1:171679226330:web:d0641694617f123e1648e3",
  measurementId: "G-EQ4VRP8896"
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




