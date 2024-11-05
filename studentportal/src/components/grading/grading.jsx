import React, { useEffect, useState } from "react";
import { db, getStudents } from "../../firebase/firebaseConfig";
import { useParams } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import axios from "axios";
import Banner from "../banner/Banner"; // Import the Banner component
import "./grading.css"; // Import the CSS file

const Grading = () => {
  const { id } = useParams();

  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  const [prevGrades, setPrevGrades] = useState({});
  const [loggedInUser, setLoggedInUser] = useState("");
  const [loading, setLoading] = useState(false);

  const getStudentsFire = async () => {
    const test = await getStudents();
    setStudents(test);
  };

  useEffect(() => {
    getStudentsFire();
  }, []);

  useEffect(() => {
    const initialGrades = {};
    students.forEach((student) => {
      initialGrades[student.rollNo] = {
        quiz: ["", "", ""], 
        assignment: ["", "", ""], 
        mid: "", 
        final: "", 
      };
    });
    setGrades(initialGrades);
  }, [students]);

  // Updates the grades data when a grade is changed
  const handleGradeChange = (studentRollNo, assessmentType, value, index) => {
    setGrades((prevGrades) => {
      const updatedGrades = { ...prevGrades };

      if (!updatedGrades[studentRollNo]) {
        updatedGrades[studentRollNo] = {
          quiz: ["", "", ""], 
          assignment: ["", "", ""], 
          mid: "", 
          final: "", 
        };
      }

      if (assessmentType === "quiz" || assessmentType === "assignment") {
        if (!updatedGrades[studentRollNo][assessmentType]) {
          updatedGrades[studentRollNo][assessmentType] = ["", "", ""];
        }
        updatedGrades[studentRollNo][assessmentType][index] = value;
      } else {
        updatedGrades[studentRollNo][assessmentType] = value;
      }

      return updatedGrades;
    });
  };
  // Fetches grades data from Firestore for the selected course 
  const fetchGrades = async () => {
    try {
      const gradesDocRef = doc(db, "grades", id);
      const gradesSnapshot = await getDoc(gradesDocRef);
      if (gradesSnapshot.exists()) {
        setPrevGrades(gradesSnapshot.data());
        setGrades(gradesSnapshot.data());
      } else {
        console.log("No grades found for this ID.");
      }
    } catch (error) {
      console.error("Error fetching grades:", error);
      toast("Error fetching grades");
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [id]);

  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);

  const currentURL = window.location.href;

  const saveGrades = async () => {
    console.log(grades);
    console.log(prevGrades);
    if (Object.keys(prevGrades).length === 0) {
      console.log("empty grades first time added");
      const gradesCollectionRef = doc(db, "grades", id);
      try {
        const url = `${import.meta.env.VITE_BASE_URL_LIVE}/LogGard/uploadLogs`;
        await axios
          .post(url, {
            teacherName: loggedInUser.name,
            action: currentURL.includes("grading")
              ? "grading"
              : currentURL.includes("attendence")
              ? "attendence"
              : "Nill",
            type: "log",
            data: grades,
          })
          .then(async (response) => {
            console.log(response.data);
            await setDoc(gradesCollectionRef, grades);
            toast.success("Grades saved successfully.");
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.error("Error saving grades:", error);
      }
    } else {
      console.log(prevGrades);
      console.log(grades);
      const gradesCollectionRef = doc(db, "grades", id);
      try {
        const url = `${import.meta.env.VITE_BASE_URL_LIVE}/LogGard/uploadLogs`;
        await axios
          .post(url, {
            teacherName: loggedInUser.name,
            action: currentURL.includes("grading")
              ? "grading"
              : currentURL.includes("attendence")
              ? "attendence"
              : "Nill",
            type: "alert",
            data: grades,
            prevData: prevGrades,
          })
          .then(async (response) => {
            console.log(response.data);
            await setDoc(gradesCollectionRef, grades);
            toast.success("Grades saved successfully.");
          })
          .catch((error) => {
            console.log(error);
          });

        console.log("Grades saved successfully.");
      } catch (error) {
        console.error("Error saving grades:", error);
      }
    }
  };

  const handleBack = () => {
    window.history.back(); // Navigates back to the previous page in history
  };

  return (
    <div className="grading-container">
      <Banner />
      <h3>Course ID: {id}</h3>
      <div className="grading-content">
        <h2>Grades Table</h2>
        <table className="grading-table">
          <thead>
            <tr>
              <th>Serial No</th> {/* Add Serial No column header */}
              <th>Student Roll No</th>
              <th>Student Name</th>
              <th>Quiz 1</th>
              <th>Quiz 2</th>
              <th>Quiz 3</th>
              <th>Assignment 1</th>
              <th>Assignment 2</th>
              <th>Assignment 3</th>
              <th>Mid</th>
              <th>Final</th>
             
            </tr>
          </thead>
          <tbody>
            {students.length > 0 &&
              students.map((student, index) => ( // Add index parameter to map function
                <tr key={student.rollNo}>
                  <td>{index + 1}</td> {/* Display serial number */}
                  <td className="roll-number">{student.rollNo}</td>
                  <td className="student-name">{student.name}</td>
                  <td>
                  <input
                      type="number"
                      value={(grades[student.rollNo]?.quiz[0]) || ""}
                      min="1"
                      max="5"
                      step="1"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= 5) {
                          handleGradeChange(student.rollNo, "quiz", value, 0);
                        } else {
                          // Optionally handle the invalid case, e.g., reset the value
                          e.target.value = (grades[student.rollNo]?.quiz[0]) || "";
                        }
                      }}
                    />
                  </td>
                  <td>
                  <input
                      type="number"
                      value={(grades[student.rollNo]?.quiz[1]) || ""}
                      min="1"
                      max="5"
                      step="1"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= 5) {
                          handleGradeChange(student.rollNo, "quiz", value, 1);
                        } else {
                          
                          e.target.value = (grades[student.rollNo]?.quiz[1]) || "";
                        }
                      }}
                    />
                  </td>
                  <td>
                  <input
                      type="number"
                      value={(grades[student.rollNo]?.quiz[2]) || ""}
                      min="1"
                      max="5"
                      step="1"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= 5) {
                          handleGradeChange(student.rollNo, "quiz", value, 2);
                        } else {
                          
                          e.target.value = (grades[student.rollNo]?.quiz[1]) || "";
                        }
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={(grades[student.rollNo]?.assignment[0]) || ""}
                      min="1"
                      max="5"
                      step="1"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= 1 && value <= 5) {
                          handleGradeChange(student.rollNo, "assignment", value, 0);
                        } else {
                          
                          e.target.value = (grades[student.rollNo]?.assignment[0]) || "";
                        }
                      }}
                    />
                  </td>
                  <td>
                    <input
                        type="number"
                        value={(grades[student.rollNo]?.assignment[1]) || ""}
                        min="1"
                        max="5"
                        step="1"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1 && value <= 5) {
                            handleGradeChange(student.rollNo, "assignment", value, 1);
                          } else {
                           
                            e.target.value = (grades[student.rollNo]?.assignment[1]) || "";
                          }
                        }}
                      />
                  </td>
                  <td>
                    <input
                        type="number"
                        value={(grades[student.rollNo]?.assignment[2]) || ""}
                        min="1"
                        max="5"
                        step="1"
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value >= 1 && value <= 5) {
                            handleGradeChange(student.rollNo, "assignment", value, 2);
                          } else {
                            
                            e.target.value = (grades[student.rollNo]?.assignment[2]) || "";
                          }
                        }}
                      />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={(grades[student.rollNo]?.mid) || ""}
                      min="0"
                      max="50"
                      step="1"
                      onChange={(e) => {
                        const value = parseInt(e.target.value, 10);
                        if (value >= 0 && value <= 50) {
                          handleGradeChange(student.rollNo, "mid", value);
                        } else {
                         
                          e.target.value = (grades[student.rollNo]?.mid) || "";
                        }
                      }}
                    />
                  </td>
                  <td>
                    <input
                        type="number"
                        value={(grades[student.rollNo]?.final) || ""}
                        min="0"
                        max="100"
                        step="1"
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (value >= 0 && value <= 100) {
                            handleGradeChange(student.rollNo, "final", value);
                          } else {
                
                            e.target.value = (grades[student.rollNo]?.final) || "";
                          }
                        }}
                      />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <button
          className="save-button"
          onClick={saveGrades}
          disabled={loading ? true : false}
        >
          {loading ? "Loading..." : "Save Grades"}
        </button>
        <button onClick={handleBack} className="back-button">Back</button>
      </div>
    </div>
  );
};

export default Grading;
