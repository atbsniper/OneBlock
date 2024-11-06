import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebaseConfig";
import students from "./students"; // Import the student data

function Addstudents() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  // Function to add a single student
  const handleAddStudent = async () => {
    if (name === "" || rollNo === "") {
      toast("Please fill the fields");
    } else {
      try {
        const docRef = await addDoc(collection(db, "students"), {
          name: name,
          rollNo: rollNo,
        });
        console.log("Document written with ID: ", docRef.id);
        toast("Student added successfully", { toastId: docRef.id });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to add students in bulk without duplicates
  const handleBulkAddStudents = async () => {
    try {
      // Step 1: Retrieve all existing students from Firestore
      const querySnapshot = await getDocs(collection(db, "students"));
      const existingStudents = querySnapshot.docs.map((doc) => ({
        rollNo: doc.data().rollNo,
      }));

      // Step 2: Filter out students already in Firestore based on rollNo
      const newStudents = students.filter(
        (student) => !existingStudents.some((existing) => existing.rollNo === student.rollNo)
      );

      // Step 3: Add only new, unique students
      if (newStudents.length > 0) {
        const batch = newStudents.map((student) =>
          addDoc(collection(db, "students"), {
            name: student.name,
            rollNo: student.rollNo,
          })
        );
        await Promise.all(batch);
        toast("New students added successfully!");
      } else {
        toast("No new students to add.");
      }
    } catch (error) {
      console.error("Error adding students in bulk:", error);
      toast("Error adding students in bulk");
    }
  };

  return (
    <div>
      <h1>Add Students</h1>
      <input
        type="text"
        placeholder="name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Roll no"
        onChange={(e) => setRollNo(e.target.value)}
      />
      <button onClick={handleAddStudent}>Add Student</button>

      <h2>Or</h2>
      <button onClick={handleBulkAddStudents}>Add Students in Bulk</button>
    </div>
  );
}

export default Addstudents;
