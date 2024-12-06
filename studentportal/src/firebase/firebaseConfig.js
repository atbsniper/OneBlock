
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMyxy0sY96aKQSwpa-3tGH_NtxAF4oK5Q",
  authDomain: "logviewer-966bc.firebaseapp.com",
  projectId: "logviewer-966bc",
  storageBucket: "logviewer-966bc.appspot.com",
  messagingSenderId: "179279904966",
  appId: "1:179279904966:web:80ee1fe727d208264157c7",
  measurementId: "G-122MQKK30H",
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
