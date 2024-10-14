import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebaseConfig";

function Addstudents() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");

  const handleAddStudent = async () => {
    if (name == "" || rollNo == "") {
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
    </div>
  );
}

export default Addstudents;
