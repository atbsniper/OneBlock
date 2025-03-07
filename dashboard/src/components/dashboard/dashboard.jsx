import React, { useEffect, useState } from "react";
import "./dashboard.css";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import AsideBar from "../asidebar/aside";

function Dashboard() {
  const [viewMode, setViewMode] = useState("daily");
  const [options, setOptions] = useState({
    chart: {
      type: "bar",
      toolbar: {
        show: false, // Remove download functionality
      },
    },
    series: [
      {
        name: "Logs",
        data: [0, 0, 0, 0, 0, 0, 0],
      },
    ],
    xaxis: {
      categories: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    },
  });

  const [showAllLogs, setShowAllLogs] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [pieChartOptions, setPieChartOptions] = useState({
    chart: {
      type: "pie",
    },
    series: [0, 0],
    labels: ["Attendence", "Grading"],
  });
  const [alertCount, setAlertCount] = useState(0);
  const [transactionHash, setTransactionHash] = useState({});
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeFilter, setActiveFilter] = useState('active');

  const getLogs = async () => {
    const url2 = `${import.meta.env.VITE_BASE_URL_LIVE}/LogGard/getLogs`;
    await axios
      .get(url2)
      .then((response) => {
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          let parsedData1;
          if (typeof parsedItem.data === "string" && parsedItem.data !== "") {
            parsedData1 = JSON.parse(parsedItem.data);
          }
          return {
            ...parsedItem,
            data: parsedData1,
            tokenId: item.tokenId,
          };
        });
        setTableData(parsedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLogs();
  }, []);

  useEffect(() => {
    if (tableData.length > 0) {
      let uniqueDates = [];
      let seriesData = [];

      if (viewMode === "daily") {
        const month = new Date(tableData[0].timestamp).toLocaleString('default', { month: 'long' });
        uniqueDates = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map(day => `${day} (${month})`);
        seriesData = uniqueDates.map((day) => {
          return tableData.reduce((count, item) => {
            const date = new Date(item.timestamp);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const itemMonth = date.toLocaleString('default', { month: 'long' });
            if (`${dayName} (${itemMonth})` === day) {
              return count + 1;
            }
            return count;
          }, 0);
        });
      } else if (viewMode === "weekly") {
        const month = new Date(tableData[0].timestamp).toLocaleString('default', { month: 'long' });
        uniqueDates = [
          ...new Set(
            tableData.map((item) => {
              const date = new Date(item.timestamp);
              const week = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)} (${date.toLocaleString('default', { month: 'long' })})`;
              return week;
            })
          ),
        ];

        seriesData = uniqueDates.map((week) => {
          return tableData.reduce((count, item) => {
            const date = new Date(item.timestamp);
            const itemWeek = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)} (${date.toLocaleString('default', { month: 'long' })})`;
            if (itemWeek === week) {
              return count + 1;
            }
            return count;
          }, 0);
        });
      } else if (viewMode === "monthly") {
        uniqueDates = [
          ...new Set(
            tableData.map((item) => item.timestamp.split("-").slice(0, 2).join("-"))
          ),
        ];

        seriesData = uniqueDates.map((monthYear) => {
          return tableData.reduce((count, item) => {
            if (item.timestamp.startsWith(monthYear)) {
              return count + 1;
            }
            return count;
          }, 0);
        });
      }

      setOptions((prevOptions) => ({
        ...prevOptions,
        xaxis: {
          categories: uniqueDates,
        },
        series: [
          {
            name: "Logs",
            data: seriesData,
          },
        ],
      }));
    }
  }, [tableData, viewMode]);

  useEffect(() => {
    if (tableData) {
      let alertCount = 0;
      let attendenceCount = 0;
      let gradingCount = 0;

      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i]?.type === "alert") {
          alertCount++;
        }
        if (tableData[i]?.action === "attendence") {
          attendenceCount++;
        }
        if (tableData[i]?.action === "grading") {
          gradingCount++;
        }
      }
      console.log(alertCount);
      setAlertCount(alertCount);
      console.log(attendenceCount);
      console.log(gradingCount);

      const actionCounts = {
        Attendence: attendenceCount,
        Grading: gradingCount,
        Alert: alertCount,
      };

      console.log(actionCounts);
      const actionLabels = Object.keys(actionCounts);
      const actionData = Object.values(actionCounts);

      setPieChartOptions({
        ...pieChartOptions,
        labels: actionLabels,
        series: actionData,
      });
    }
  }, [tableData]);

  const getTransactionHashes = async () => {
    const docRef = collection(db, "transactionHashes");
    let temp = {};

    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
      temp[doc.id] = doc.data().transactionHash;
    });
    setTransactionHash(temp);
  };

  useEffect(() => {
    getTransactionHashes();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUserLog"));
        if (!loggedInUser) return;

        // Fetch courses from teachers collection
        const teachersRef = collection(db, "teachers");
        const teachersSnapshot = await getDocs(teachersRef);
        let allCourses = [];
        let studentCount = 0;

        for (const teacherDoc of teachersSnapshot.docs) {
          const teacherData = teacherDoc.data();
          if (teacherData.courses) {
            allCourses = [...allCourses, ...teacherData.courses];
          }
        }

        // Fetch student count for each course
        const studentsRef = collection(db, "students");
        const studentsSnapshot = await getDocs(studentsRef);
        studentCount = studentsSnapshot.docs.length;

        setCourses(allCourses);
        setTotalStudents(studentCount);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const filterCourses = (status) => {
    setActiveFilter(status);
  };

  return (
    <div className="dashboard-main-wrapper">
      <AsideBar />
      <div className="dashboard-content">
        {/* Header Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{courses.length}</h3>
            <p>TOTAL COURSES</p>
          </div>
          <div className="stat-card">
            <h3>{totalStudents}</h3>
            <p>TOTAL STUDENTS</p>
          </div>
          <div className="stat-card">
            <h3>83%</h3>
            <p>TOTAL BOOK ACCESS</p>
          </div>
          <div className="stat-card">
            <h3>16m 0s</h3>
            <p>AVERAGE SESSION LENGTH</p>
          </div>
        </div>

        {/* Course Filters */}
        <div className="course-filters">
          <button 
            className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
            onClick={() => filterCourses('active')}
          >
            Active ({courses.length})
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'inactive' ? 'active' : ''}`}
            onClick={() => filterCourses('inactive')}
          >
            Inactive (0)
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => filterCourses('all')}
          >
            All ({courses.length})
          </button>
        </div>

        {/* Course Grid */}
        <div className="course-grid">
          {courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className="course-header">
                <h4>{course.courseID}</h4>
                <p>{course.courseName}</p>
              </div>
              <div className="course-wave">
                {/* Wave SVG or background */}
              </div>
              <div className="course-footer">
                <div className="student-count">
                  <i className="fas fa-users"></i>
                  <span>{totalStudents} Students</span>
                </div>
                <div className="course-actions">
                  <button className="action-btn">•••</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
