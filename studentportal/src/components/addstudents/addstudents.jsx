import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../firebase/firebaseConfig";
import "./addstudents.css";

function Addstudents() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [students, setStudents] = useState([]);

  const studentsCollection = collection(db, "students");

  // Fetch students from Firestore
  const fetchStudents = async () => {
    try {
      const querySnapshot = await getDocs(studentsCollection);
      const studentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentsData);
    } catch (error) {
      console.error("Error fetching students: ", error);
      toast("Error fetching students, please try again.");
    }
  };

  // Function to add a single student
  const handleAddStudent = async () => {
    if (!name || !rollNo) {
      toast("Please fill in all fields");
      return;
    }
    try {
      const docRef = await addDoc(studentsCollection, {
        name: name,
        rollNo: rollNo,
      });
      console.log("Document written with ID: ", docRef.id);
      toast("Student added successfully", { toastId: docRef.id });
      // Clear input fields
      setName("");
      setRollNo("");
      // Refresh student list
      fetchStudents();
    } catch (error) {
      console.error("Error adding student: ", error);
      toast("Error adding student, please try again.");
    }
  };

  // Function to delete a student
  const handleDeleteStudent = async (id) => {
    try {
      await deleteDoc(doc(db, "students", id));
      toast("Student deleted successfully");
      // Refresh student list
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student: ", error);
      toast("Error deleting student, please try again.");
    }
  };

  // Fetch students when the component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="add-students-container">
      <h1>Manage Students</h1>

      {/* Add Student Form */}
      <div className="add-student-form">
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

      {/* List of Students */}
      <div className="students-list">
        <h2>Students</h2>
        {students.length === 0 ? (
          <p>No students added yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.rollNo}</td>
                  <td>
                    <button onClick={() => handleDeleteStudent(student.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Addstudents;
