import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import "./dashboard.css";
import Banner from "../banner/Banner";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [avgGrade, setAvgGrade] = useState(0);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("User data from localStorage:", userData);
    setLoggedInUser(userData);
  }, []);

  useEffect(() => {
    if (loggedInUser && loggedInUser.courses) {
      fetchStudentData();
    }
  }, [loggedInUser]);

  const fetchStudentData = async () => {
    if (!loggedInUser || !loggedInUser.courses) return;

    try {
      // Get all students - this should return exactly 7 students
      const studentsSnapshot = await getDocs(collection(db, "students"));
      const students = [];
      studentsSnapshot.forEach(doc => {
        students.push({...doc.data(), id: doc.id});
      });
      
      console.log("Total students found:", students.length);
      setTotalStudents(students.length);
      
      // Calculate attendance rate (random for demo)
      const attendancePercent = Math.floor(Math.random() * 20) + 75; // 75-95%
      setAttendanceRate(attendancePercent);
      
      // Calculate average grade (random for demo)
      const grade = Math.floor(Math.random() * 15) + 75; // 75-90
      setAvgGrade(grade);

      // All classes have the same number of students
      const studentCount = students.length;
      
      // Prepare courses with student counts - all courses have the same student count
      const coursesWithCounts = loggedInUser.courses.map(course => {
        return {
          ...course,
          studentCount: studentCount, // All classes have the same number of students
          status: "active" // All courses are active by default
        };
      });

      setCourses(coursesWithCounts);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const filterCourses = (status) => {
    setActiveFilter(status);
  };

  const filteredCourses = courses.filter(course => {
    if (activeFilter === "all") return true;
    return course.status === activeFilter;
  });

  const handleCourseClick = (courseID) => {
    setSelectedCourse(courseID);
  };

  return (
    <div>
      <div className="banner-container">
        <Banner />
      </div>
      
      {!selectedCourse ? (
        <div className="dashboard-main-wrapper">
          <div className="dashboard-content">
            <h2 className="welcome-text">Welcome {loggedInUser?.name}</h2>
            
            {/* Stats Section */}
            <div className="dashboard-stats">
              <div className="stat-card">
                <h3>TOTAL COURSES</h3>
                <p>{courses.length}</p>
              </div>
              <div className="stat-card">
                <h3>TOTAL STUDENTS</h3>
                <p>{totalStudents}</p>
              </div>
              <div className="stat-card">
                <h3>ATTENDANCE RATE</h3>
                <p>{attendanceRate}%</p>
              </div>
              <div className="stat-card">
                <h3>AVG GRADE</h3>
                <p>{avgGrade}/100</p>
              </div>
            </div>
            
            {/* Course Filters */}
            <div className="course-filters">
              <button 
                className={`filter-btn ${activeFilter === 'active' ? 'active' : ''}`}
                onClick={() => filterCourses('active')}
              >
                Active ({courses.filter(c => c.status === 'active').length})
              </button>
              <button 
                className={`filter-btn ${activeFilter === 'inactive' ? 'active' : ''}`}
                onClick={() => filterCourses('inactive')}
              >
                Inactive ({courses.filter(c => c.status === 'inactive').length})
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
              {filteredCourses.map((course, index) => (
                <div 
                  key={index} 
                  className="course-card"
                  onClick={() => handleCourseClick(course.courseID)}
                >
                  <div className="course-header">
                    <h4 className="course-code">{course.courseID || `COURSE${index+1}`}</h4>
                    <p>{course.courseName}</p>
                  </div>
                  <div className="course-wave"></div>
                  <div className="course-footer">
                    <div className="student-count">
                      <i className="fas fa-user-graduate"></i>
                      <span>{course.studentCount} Students</span>
                    </div>
                    <button className="action-btn">
                      <i className="fas fa-ellipsis-v"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="logout-container">
              <button onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      ) : (
        <div className="dashboard">
          <div className="selected-course">
            Selected Course: {selectedCourse}
          </div>
          <div className="action-boxes">
            <div
              className="box"
              onClick={() => navigate(`/attendence/${selectedCourse}`)}
            >
              Attendance
            </div>
            <div
              className="box"
              onClick={() => navigate(`/grading/${selectedCourse}`)}
            >
              Grading
            </div>
            <div
              className="box"
              onClick={() => navigate(`/announcement/${selectedCourse}`)}
            >
              Add Announcement
            </div>
          </div>
          <button 
            className="back-button" 
            onClick={() => setSelectedCourse("")}
          >
            Back to Dashboard
          </button>
          <div className="logout-container">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;