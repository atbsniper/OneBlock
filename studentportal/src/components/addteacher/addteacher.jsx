import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid"; // Import UUID library to generate unique IDs

function AddTeacher() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState([]);
  const addTeacherFirebase = async () => {
    console.log(courses.length);
    if (name == "" || password == "" || courses.length == 0) {
      toast("Please fill the fields");
    } else {
      try {
        const docRef = await addDoc(collection(db, "teachers"), {
          name: name,
          password: password,
          courses: courses,
        });
        console.log("Document written with ID: ", docRef.id);
        toast("Teacher added successfully", { toastId: docRef.id });
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Function to generate a unique courseID based on courseName
  const generateCourseId = (courseName) => {
    // Here, you can implement your own logic to generate courseID based on courseName
    // For now, I'm using a simple UUID generator
    return uuidv4();
  };

  // Function to handle input change
  const handleInputChange = () => {
    // const courseName = e.target.value;
    const courseID = generateCourseId(course);

    // Update state with the new course object
    setCourses([...courses, { courseName: course, courseID: courseID }]);
  };

  useEffect(() => {
    console.log(courses);
  }, [courses]);

  return (
    <div>
      <h1>Add Teacher/Courses</h1>
      <input
        type="text"
        placeholder="Teacher Name"
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        type="text"
        placeholder="Courses"
        onChange={(e) => setCourse(e.target.value)}
      />
      <button onClick={handleInputChange}>Add course</button>

      <ul>
        {/* Display the list of courses */}
        {courses.map((course, index) => (
          <li key={index}>
            Course Name: {course.courseName}, Course ID: {course.courseID}
          </li>
        ))}
      </ul>

      <button onClick={addTeacherFirebase}>Add teacher</button>
    </div>
  );
}

export default AddTeacher;
