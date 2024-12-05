// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getFirestore } from "firebase/firestore";
import { collection, getDoc } from "firebase/firestore";

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

export const getAdmin = async () => {
  let students;
  const docRef = doc(db, "admin", "adminCredentials");

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    students = docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  return students;
  // console.log(students);
};
