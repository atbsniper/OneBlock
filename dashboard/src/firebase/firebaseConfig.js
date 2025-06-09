// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getFirestore } from "firebase/firestore";
import { collection, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDFt0rjaA2EXpwMk0KyyI01HOKx7JNn2FE",
  authDomain: "oneblock-e3742.firebaseapp.com",
  projectId: "oneblock-e3742",
  storageBucket: "oneblock-e3742.firebasestorage.app",
  messagingSenderId: "531374953707",
  appId: "1:531374953707:web:2c7aa24c05a43ffab39aae",
};

// Initialize Firebase
let app;
let db;

try {
  console.log("Initializing Firebase...");
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { db };

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
