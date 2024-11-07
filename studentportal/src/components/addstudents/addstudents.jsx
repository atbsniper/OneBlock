import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebaseConfig";
import "./addstudents.css";

function Addstudents() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const handleAddStudent = async () => {
    if (!name || !rollNo) {
      toast("Please fill in all fields");
      return;
    }
    try {
      // Attempt to add document to "students" collection
      const docRef = await addDoc(collection(db, "students"), {
        name: name,
        rollNo: rollNo,
      });
      console.log("Document written with ID: ", docRef.id);
      toast("Student added successfully", { toastId: docRef.id });
      // Clear input fields
      setName("");
      setRollNo("");
    } catch (error) {
      console.error("Error adding student: ", error);
      toast("Error adding student, please try again.");
    }
  };

  return (
    <div className="add-students-container">
      <h1>Add Students</h1>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Roll No"
        value={rollNo}
        onChange={(e) => setRollNo(e.target.value)}
      />
      <button onClick={handleAddStudent}>Add Student</button>
    </div>
  );
}

export default Addstudents;
