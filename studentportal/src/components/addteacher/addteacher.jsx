import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import "./addteacher.css"; // Import the CSS file

function AddTeacher() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState("");
  const [courseID, setCourseID] = useState(""); // State for course ID input

  const addTeacherFirebase = async () => {
    if (name === "" || password === "" || courses.length === 0) {
      toast("Please fill the fields");
    } else {
      try {
        const docRef = await addDoc(collection(db, "teachers"), {
          name,
          password,
          courses,
        });
        console.log("Document written with ID: ", docRef.id);
        toast("Teacher added successfully", { toastId: docRef.id });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to handle course addition
  const handleInputChange = () => {
    if (course === "") {
      toast("Please enter a course name");
      return;
    }

    // Use user-provided courseID or generate one
    const newCourseID = courseID || uuidv4();
    setCourses([...courses, { courseName: course, courseID: newCourseID }]);
    setCourse(""); // Clear course input
    setCourseID(""); // Clear course ID input
  };

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  return (
    <div className="add-teacher-container"> {/* Scoped container */}
      <h1>Add Teacher/Courses</h1>
      <input
        type="text"
        placeholder="Teacher Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="text"
        placeholder="Course Name"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      />
      <input
        type="text"
        placeholder="Course ID (optional)"
        value={courseID}
        onChange={(e) => setCourseID(e.target.value)}
      />
      <button onClick={handleInputChange}>Add Course</button>

      <ul>
        {courses.map((course, index) => (
          <li key={index}>
            Course Name: <span>{course.courseName}</span>, Course ID: <span>{course.courseID}</span>
          </li>
        ))}
      </ul>

      <button onClick={addTeacherFirebase}>Add Teacher</button>
    </div>
  );
}

export default AddTeacher;
