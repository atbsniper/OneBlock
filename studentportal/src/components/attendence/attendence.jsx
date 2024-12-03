import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db, getStudents } from "../../firebase/firebaseConfig";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import axios from "axios";
import { toast } from "react-toastify";
import Banner from "../banner/Banner";
import "./attendence.css";

const Attendance = () => {
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStudents = async () => {
    try {
      const studentsList = await getStudents();
      setStudents(studentsList);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);
  }, []);

  useEffect(() => {
    if (students.length) {
      const defaultAttendance = students.map((student) => ({
        rollNo: student.rollNo,
        name: student.name,
        isPresent: false,
      }));
      setAttendanceData(defaultAttendance);
    }
  }, [students]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const fetchAttendanceForDate = async () => {
    if (!selectedDate) return;

    const attendanceDocRef = doc(db, "attendance", id);
    try {
      const docSnap = await getDoc(attendanceDocRef);
      if (docSnap.exists()) {
        const dataForDate = docSnap.data()[selectedDate] || {};
        const updatedAttendance = students.map((student) => ({
          rollNo: student.rollNo,
          name: student.name,
          isPresent: dataForDate[student.rollNo]?.isPresent || false,
        }));
        setAttendanceData(updatedAttendance);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    fetchAttendanceForDate();
  }, [selectedDate]);

  const toggleAttendance = (rollNo) => {
    setAttendanceData((prevData) =>
      prevData.map((record) =>
        record.rollNo === rollNo
          ? { ...record, isPresent: !record.isPresent }
          : record
      )
    );
  };

  const saveAttendance = async () => {
    if (!selectedDate) {
      toast.error("Please select a date");
      return;
    }

    setLoading(true);
    const url = `${import.meta.env.VITE_BASE_URL_LIVE}/LogGard/uploadLogs`;
    const attendanceDocRef = doc(db, "attendance", id);
    const attendanceRecord = attendanceData.reduce((acc, curr) => {
      acc[curr.rollNo] = { name: curr.name, isPresent: curr.isPresent };
      return acc;
    }, {});

    try {
      const docSnap = await getDoc(attendanceDocRef);
      const existingData = docSnap.exists() ? docSnap.data() : {};

      const isFirstTime = !existingData[selectedDate];
      const actionType = isFirstTime ? "log" : "alert";

      await axios.post(url, {
        teacherName: loggedInUser.name,
        action: "attendance",
        type: actionType,
        data: attendanceRecord,
        prevData: existingData[selectedDate] || {},
      });

      await setDoc(
        attendanceDocRef,
        { [selectedDate]: attendanceRecord },
        { merge: true }
      );

      toast.success("Attendance saved successfully");
    } catch (error) {
      console.error("Error saving attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-container">
      <Banner />
      <h3>Course ID: {id}</h3>

      <div className="attendance-content">
        <h2>Attendance Table</h2>

        <div className="date-picker">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
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
            {attendanceData.map((student, index) => (
              <tr key={student.rollNo}>
                <td>{index + 1}</td>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={student.isPresent}
                    onChange={() => toggleAttendance(student.rollNo)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={saveAttendance} disabled={loading}>
          {loading ? "Saving..." : "Save Attendance"}
        </button>
        <button onClick={() => window.history.back()}>Back</button>
      </div>
    </div>
  );
};

export default Attendance;
