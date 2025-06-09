import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, getStudents } from "../../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  setDoc,
  Timestamp,
  getDocs,
} from "firebase/firestore";
import axios from "axios";
import { toast } from "react-toastify";
import Banner from "../banner/Banner";
import "./attendence.css"; 
import { sendAttendanceNotifications } from "./attendanceNotifier";

const Attendance = () => {
  const { id } = useParams();
  const [students, setStudents] = useState();
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceData, setAttendanceData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAttendanceData, setFilteredAttendanceData] = useState([]);

  const getStudentsFire = async () => {
    const test = await getStudents();
    setStudents(test);
  };

  useEffect(() => {
    getStudentsFire();
  }, []);

  // Initializes the attendance data based
  useEffect(() => {
    if (students) {
      console.log(students);
      setAttendanceData(() => {
        return students.map((student) => ({
          rollNo: student.rollNo,
          isPresent: false,
          name: student.name,
        }));
      });
    }
  }, [students]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleBack = () => {
    window.history.back();
  };

  // Fetches attendance data
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (selectedDate) {
        const attendanceDocRef = doc(db, "attendance", id);
        try {
          const attendanceDocSnap = await getDoc(attendanceDocRef);
          if (attendanceDocSnap.exists()) {
            const attendanceRecord = attendanceDocSnap.data()[selectedDate];
            console.log(attendanceRecord);
            const newAttendanceData = students.map((student) => ({
              rollNo: student.rollNo,
              name: student.name,
              isPresent:
                attendanceRecord && attendanceRecord[student.rollNo]
                  ? attendanceRecord[student.rollNo].isPresent
                  : false,
            }));
            console.log(newAttendanceData);
            setAttendanceData(newAttendanceData);
          } else {
            setAttendanceData(() => {
              return students.map((student) => ({
                rollNo: student.rollNo,
                name: student.name,
                isPresent: false,
              }));
            });
          }
        } catch (error) {
          console.error("Error fetching attendance:", error);
        }
      }
    };

    fetchAttendanceData();
  }, [selectedDate]);

  const handleAttendanceChange = (rollNo) => {
    setAttendanceData((prevAttendanceData) => {
      const updatedAttendanceData = prevAttendanceData.map((data) => {
        if (data.rollNo === rollNo) {
          return { ...data, isPresent: !data.isPresent };
        }
        return data;
      });
      return updatedAttendanceData;
    });
  };

  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
    console.log(JSON.parse(localStorage.getItem("loggedInUser")));
  }, [localStorage.getItem("loggedInUser")]);

  const currentURL = window.location.href;
  const [loading, setLoading] = useState(false);

  // Saves the attendance data to Firestore
  const handleSaveAttendance = async () => {
    setLoading(true);
    const url = `${import.meta.env.VITE_BASE_URL_LIVE}/LogGard/uploadLogs`;

    const attendanceCollectionRef = doc(db, "attendance", id);
    const attendanceRecord = {};
    attendanceData.forEach((data) => {
      attendanceRecord[data.rollNo] = {
        name: data.name,
        isPresent: data.isPresent,
      };
    });
    try {
      const attendanceDocSnap = await getDoc(attendanceCollectionRef);
      console.log(attendanceDocSnap.data());
      
      // Get course details for notification
      const courseDocRef = doc(db, "courses", id);
      const courseDocSnap = await getDoc(courseDocRef);
      const courseName = courseDocSnap.exists() ? courseDocSnap.data().name || id : id;
      
      // Get student Firebase IDs mapping
      const studentIdMap = {};
      const studentsCollectionRef = collection(db, "students");
      const studentSnapshot = await getDocs(studentsCollectionRef);
      studentSnapshot.forEach(doc => {
        const studentData = doc.data();
        if (studentData.rollNo) {
          studentIdMap[studentData.rollNo] = doc.id; // Map rollNo to Firestore ID
        }
      });
      console.log("Student ID mapping:", studentIdMap);
      
      if (attendanceDocSnap.data()) {
        console.log(attendanceDocSnap.data()[selectedDate]);
        if (attendanceDocSnap.data()[selectedDate]) {
          console.log("record already present");
          console.log(typeof attendanceRecord);
          console.log(attendanceRecord);
          await axios
            .post(url, {
              teacherName: loggedInUser.name,
              action: currentURL.includes("grading")
                ? "grading"
                : currentURL.includes("attendence")
                ? "attendance"
                : "Nill",
              type: "alert",
              data: attendanceRecord,
              prevData: attendanceDocSnap.data()[selectedDate],
            })
            .then(async (response) => {
              console.log(response.data);
              if (response.data.status) {
                // Update attendance in Firebase
                await setDoc(
                  attendanceCollectionRef,
                  {
                    [selectedDate]: attendanceRecord,
                  },
                  { merge: true }
                );
                
                // Send notifications to students
                try {
                  // Create a notification-friendly structure where keys are student IDs and values are "present" or "absent"
                  const notificationData = {};
                  attendanceData.forEach(data => {
                    // Use the Firestore ID instead of rollNo for the notification
                    if (studentIdMap[data.rollNo]) {
                      notificationData[studentIdMap[data.rollNo]] = data.isPresent ? 'present' : 'absent';
                    }
                  });
                  
                  await sendAttendanceNotifications(
                    notificationData,
                    id, 
                    courseName,
                    loggedInUser.name || "Instructor",
                    selectedDate
                  );
                  
                  console.log("Attendance notifications sent successfully");
                } catch (notificationError) {
                  console.error("Error sending attendance notifications:", notificationError);
                }
                
                toast("Attendance uploaded successfully");
                setLoading(false);
              }
            })
            .catch((error) => {
              console.log(error);
              toast("Something went wrong");
              setLoading(false);
            });
        } else {
          console.log("record is first time added");
          await axios
            .post(url, {
              teacherName: loggedInUser.name,
              action: currentURL.includes("grading")
                ? "grading"
                : currentURL.includes("attendence")
                ? "attendance"
                : "Nill",
              type: "log",
              data: attendanceRecord,
            })
            .then(async (response) => {
              console.log(response.data);
              if (response.data.status) {
                try {
                  // Update attendance in Firebase
                  await setDoc(
                    attendanceCollectionRef,
                    {
                      [selectedDate]: attendanceRecord,
                    },
                    { merge: true }
                  );
                  
                  // Send notifications to students
                  try {
                    // Create a notification-friendly structure where keys are student IDs and values are "present" or "absent"
                    const notificationData = {};
                    attendanceData.forEach(data => {
                      // Use the Firestore ID instead of rollNo for the notification
                      if (studentIdMap[data.rollNo]) {
                        notificationData[studentIdMap[data.rollNo]] = data.isPresent ? 'present' : 'absent';
                      }
                    });
                    
                    await sendAttendanceNotifications(
                      notificationData,
                      id, 
                      courseName,
                      loggedInUser.name || "Instructor",
                      selectedDate
                    );
                    
                    console.log("Attendance notifications sent successfully");
                  } catch (notificationError) {
                    console.error("Error sending attendance notifications:", notificationError);
                  }
                  
                  toast("Attendance uploaded successfully");
                  setLoading(false);
                } catch (error) {
                  console.log(error);
                  toast("Something went wrong");
                  setLoading(false);
                }
              }
            })
            .catch((error) => {
              console.log(error);
              toast("Something went wrong");
              setLoading(false);
            });
        }
      } else {
        console.log("record is first time added when no record exists in db");
        await axios
          .post(url, {
            teacherName: loggedInUser.name,
            action: currentURL.includes("grading")
              ? "grading"
              : currentURL.includes("attendence")
              ? "attendance"
              : "Nill",
            type: "log",
            data: attendanceRecord,
          })
          .then(async (response) => {
            console.log(response.data);
            if (response.data.status) {
              try {
                // Update attendance in Firebase
                await setDoc(
                  attendanceCollectionRef,
                  {
                    [selectedDate]: attendanceRecord,
                  },
                  { merge: true }
                );
                
                // Send notifications to students
                try {
                  // Create a notification-friendly structure where keys are student IDs and values are "present" or "absent"
                  const notificationData = {};
                  attendanceData.forEach(data => {
                    // Use the Firestore ID instead of rollNo for the notification
                    if (studentIdMap[data.rollNo]) {
                      notificationData[studentIdMap[data.rollNo]] = data.isPresent ? 'present' : 'absent';
                    }
                  });
                  
                  await sendAttendanceNotifications(
                    notificationData,
                    id, 
                    courseName,
                    loggedInUser.name || "Instructor",
                    selectedDate
                  );
                  
                  console.log("Attendance notifications sent successfully");
                } catch (notificationError) {
                  console.error("Error sending attendance notifications:", notificationError);
                }
                
                toast("Attendance uploaded successfully");
                setLoading(false);
              } catch (error) {
                console.log(error);
                toast("Something went wrong");
                setLoading(false);
              }
            }
          })
          .catch((error) => {
            console.log(error);
            toast("Something went wrong");
            setLoading(false);
          });
      }
    } catch (error) {
      console.error("Error saving attendance:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(attendanceData);
  }, [attendanceData]);

  // Add useEffect for filtering attendance data based on search term
  useEffect(() => {
    if (!attendanceData) return;
    
    if (searchTerm === "") {
      setFilteredAttendanceData(attendanceData);
    } else {
      const filtered = attendanceData.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.rollNo.toString().includes(searchTerm.toLowerCase())
      );
      setFilteredAttendanceData(filtered);
    }
  }, [searchTerm, attendanceData]);

  return (
    <div className="attendance-container">
      <Banner />

      <h3>Course ID: {id}</h3>
      <div className="attendance-content">
        <h2>Attendance Table</h2>
        <div className="date-picker">
          <label htmlFor="date">Select Date: </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name or roll number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Roll No</th>
              <th>Name</th>
              <th>Attendance</th>
            </tr>
          </thead>
          <tbody>
            {filteredAttendanceData?.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={student.isPresent}
                    onChange={() => handleAttendanceChange(student.rollNo)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="save-button"
          onClick={handleSaveAttendance}
          disabled={loading ? true : false}
        >
          {loading ? "Loading..." : "Save Attendance"}
        </button>
        <div className="logout-container">
          <button onClick={handleBack}>Back</button>
        </div>
      </div>
    </div>
  );
};

export default Attendance;