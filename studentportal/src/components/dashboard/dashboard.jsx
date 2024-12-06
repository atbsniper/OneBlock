import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import Banner from "../banner/Banner"; 

const Dashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState("");
  const navigate = useNavigate();

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const [loggedInUser, setLoggedInUser] = useState(null);
  useEffect(() => {
    setLoggedInUser(JSON.parse(localStorage.getItem("loggedInUser")));
  }, []);

  useEffect(() => {
    console.log(loggedInUser);
  }, [loggedInUser]);

  const handleLogout = () => {
    setLoggedInUser(null);
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  return (
    <div>
      <div className="banner-container">
        <Banner /> {/* Add the Banner component */}
      </div>
      <div className="dashboard">
        <h2>Welcome {loggedInUser?.name}, Select a Course</h2>
        <div className="course-boxes">
          {loggedInUser?.courses?.map((course, index) => (
            <div 
              key={index} 
              className="course-box"
              onClick={() => handleCourseSelect(course.courseID)}
            >
              {course.courseName}
            </div>
          ))}
        </div>

        {selectedCourse && (
          <>
            <h3>Selected Course: {selectedCourse}</h3>
            <div className="action-boxes">
              <div className="box" onClick={() => navigate(`/attendence/${selectedCourse}`)}>
                Attendance
              </div>
              <div className="box" onClick={() => navigate(`/grading/${selectedCourse}`)}>
                Grading
              </div>
            </div>
          </>
        )}
        <div className="container logout-container">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
