import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Banner from "../banner/Banner";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [activeCourses, setActiveCourses] = useState([]);
  const [inactiveCourses, setInactiveCourses] = useState([]);
  const [currentTab, setCurrentTab] = useState('active');
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user) {
      console.log("Logged-in user data:", user);
      setLoggedInUser(user);
    }
  }, []);

  useEffect(() => {
    if (loggedInUser) {
      console.log("Triggering fetchCourses with user:", loggedInUser);
      fetchCourses();
    }
  }, [loggedInUser]);

  useEffect(() => {
    let filtered;
    if (currentTab === 'active') {
      filtered = activeCourses;
    } else if (currentTab === 'inactive') {
      filtered = inactiveCourses;
    } else {
      filtered = courses;
    }
    
    if (searchTerm) {
      filtered = filtered.filter(course => 
        (course.courseName && course.courseName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.courseID && course.courseID.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (course.courseCode && course.courseCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredCourses(filtered);
  }, [searchTerm, activeCourses, inactiveCourses, courses, currentTab]);

  const calculateTotalStudents = (coursesArray) => {
    return coursesArray.reduce((total, course) => {
      const studentCount = 
        parseInt(course.studentCount) || 
        parseInt(course.students) || 
        parseInt(course.studentCount?.length) || 
        parseInt(course.students?.length) || 
        parseInt(course.enrolledStudents) || 
        parseInt(course.enrolledStudents?.length) || 
        7; // As per your confirmation that each course has 7 students
      return total + studentCount;
    }, 0);
  };

  const fetchCourses = async () => {
    try {
      if (!loggedInUser) {
        console.error("No logged in user found");
        return;
      }
      
      console.log("Attempting to fetch courses for user:", loggedInUser);
      
      if (loggedInUser.courses && loggedInUser.courses.length > 0) {
        console.log("Using courses directly from user object:", loggedInUser.courses);
        
        const userCourses = loggedInUser.courses.map(course => ({
          ...course,
          isActive: course.isActive !== undefined ? course.isActive : true
        }));
        
        const userActive = userCourses.filter(course => course.isActive === true);
        const userInactive = userCourses.filter(course => course.isActive === false);
        
        console.log("Direct user courses - Active:", userActive.length);
        console.log("Direct user courses - Inactive:", userInactive.length);
        console.log("Direct user courses - Total:", userCourses.length);
        
        setActiveCourses(userActive);
        setInactiveCourses(userInactive);
        setCourses(userCourses);
        
        setTotalStudents(calculateTotalStudents(userCourses));
        
        return;
      }
      
      const possibleIds = [
        loggedInUser.id,
        loggedInUser.ID,
        loggedInUser.userId,
        loggedInUser.userID,
        loggedInUser.instructorId,
        loggedInUser.instructorID,
        loggedInUser._id,
        loggedInUser.uid
      ].filter(id => id !== undefined);
      
      console.log("Possible instructor IDs to search for:", possibleIds);
      
      if (possibleIds.length === 0) {
        console.error("No valid ID found in the user object");
        return;
      }
      
      const coursesCollection = collection(db, "courses");
      const allCoursesSnapshot = await getDocs(coursesCollection);
      console.log("Total courses in Firebase:", allCoursesSnapshot.size);
      
      const allCourses = allCoursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log("All courses from Firebase:", allCourses);
      
      const instructorCourses = allCourses.filter(course => {
        return possibleIds.some(id => 
          course.instructorId === id ||
          course.instructorID === id ||
          course.instructor_id === id ||
          course.instructor === id ||
          course.teacherId === id ||
          course.teacherID === id ||
          course.teacher_id === id ||
          course.teacher === id ||
          course.userId === id ||
          course.userID === id ||
          course.user_id === id
        );
      });
      
      console.log("Instructor courses found:", instructorCourses);
      
      if (instructorCourses.length > 0) {
        const processedCourses = instructorCourses.map(course => ({
          ...course,
          isActive: course.isActive !== undefined ? course.isActive : true
        }));
        
        const active = processedCourses.filter(course => course.isActive === true);
        const inactive = processedCourses.filter(course => course.isActive === false);
        
        console.log("Firebase courses - Active:", active.length);
        console.log("Firebase courses - Inactive:", inactive.length);
        console.log("Firebase courses - Total:", processedCourses.length);
        
        setActiveCourses(active);
        setInactiveCourses(inactive);
        setCourses(processedCourses);
        
        setTotalStudents(calculateTotalStudents(processedCourses));
      } else {
        console.warn("No courses found for this instructor in Firebase");
        setActiveCourses([]);
        setInactiveCourses([]);
        setCourses([]);
        setTotalStudents(0);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setActiveCourses([]);
      setInactiveCourses([]);
      setCourses([]);
      setTotalStudents(0);
    }
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const handleBack = () => {
    setSelectedCourse("");
  };

  const toggleView = (mode) => {
    setViewMode(mode);
  };

  return (
    <div>
      <div className="banner-container">
        <Banner />
      </div>
      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <div className="institution-info">
            <div className="institution-avatar">
              {loggedInUser?.name ? loggedInUser.name.charAt(0).toUpperCase() : ""}
            </div>
            <div className="institution-details">
              <h2>Welcome</h2>
              <h3>{loggedInUser?.name || ""}</h3>
              <p>{loggedInUser?.email || ""}</p>
            </div>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-box">
              <span className="stat-number" data-stat="attendance">75%</span>
              <span className="stat-label">Average Attendance</span>
            </div>
            <div className="stat-box">
              <span className="stat-number" data-stat="grade">70/100</span>
              <span className="stat-label">Average Grade</span>
            </div>
            <div className="stat-box">
              <span className="stat-number" data-stat="students">{totalStudents}</span>
              <span className="stat-label">TOTAL STUDENTS</span>
            </div>
          </div>
        </div>

        {!selectedCourse ? (
          <div className="courses-section">
            <div className="courses-header">
              <div className="tab-group">
                <button 
                  className={`tab ${currentTab === 'active' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('active')}
                >
                  Active ({activeCourses.length})
                </button>
                <button 
                  className={`tab ${currentTab === 'inactive' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('inactive')}
                >
                  Inactive ({inactiveCourses.length})
                </button>
                <button 
                  className={`tab ${currentTab === 'all' ? 'active' : ''}`}
                  onClick={() => setCurrentTab('all')}
                >
                  All ({courses.length})
                </button>
              </div>
              <div className="courses-actions">
                <div className="view-toggle">
                  <button 
                    className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                    onClick={() => toggleView("list")}
                  >
                    <i className="list-icon"></i>
                  </button>
                  <button 
                    className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                    onClick={() => toggleView("grid")}
                  >
                    <i className="grid-icon"></i>
                  </button>
                </div>
                <div className="search-box">
                  <input
                    className="search-input"
                    type="text"
                    placeholder="Search Courses"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="showing-text">
              Showing {filteredCourses.length} of {
                currentTab === 'active' ? activeCourses.length :
                currentTab === 'inactive' ? inactiveCourses.length :
                courses.length
              } Courses
            </div>
            
            <div className={`course-${viewMode}`}>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => (
                  <div 
                    key={index} 
                    className={`course-card ${viewMode === "list" ? "list-view" : ""}`}
                    onClick={() => setSelectedCourse(course.courseID)}
                  >
                    <div className="course-content">
                      <div className="course-code">{course.courseID || course.courseCode || "Course"}</div>
                      <div className="course-title">{course.courseName || "Unnamed Course"}</div>
                      <div className="course-details">
                        <span>{course.courseID || course.courseCode || ""}</span>
                        <span>{course.dates || "01/16 - 02/12 2024"}</span>
                      </div>
                      <div className="student-count">
                        <i className="student-icon"></i> {
                          parseInt(course.studentCount) || 
                          parseInt(course.students) || 
                          parseInt(course.studentCount?.length) || 
                          parseInt(course.students?.length) || 
                          parseInt(course.enrolledStudents) || 
                          parseInt(course.enrolledStudents?.length) || 
                          7
                        } Students
                      </div>
                    </div>
                    <div className="course-wave"></div>
                  </div>
                ))
              ) : (
                <div className="no-courses">
                  <p>No courses found {searchTerm ? "matching your search" : "for this category"}.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
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
          </>
        )}
        
        {!selectedCourse ? (
          <div className="logout-container">
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className="logout-container">
            <button onClick={handleBack}>Back</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;