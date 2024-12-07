import React, { useEffect, useState } from "react";
import "./asidebar.css";
import { Link, useNavigate } from "react-router-dom";

function AsideBar() {
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("loggedInUserLog");
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  useEffect(() => {
    const test = localStorage.getItem("loggedInUserLog");
    if (test !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <button
        className={`sidebar-toggle ${isSidebarVisible ? "active" : ""}`}
        onClick={toggleSidebar}
        aria-label={isSidebarVisible ? "Close Sidebar" : "Open Sidebar"}
      >
        {isSidebarVisible ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div className={`main-aside-wrapp ${isSidebarVisible ? "active" : ""}`}>
        <h1 className="mt-3 text-center text-bold">ONEBLOCK</h1>
        <ul>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/alerts">Alerts</Link>
          </li>
          <li>
            <Link to="/report">Log Viewer</Link>
          </li>
        </ul>
        <div className="logoutwrapp">
          <button className="btn" onClick={handleLogOut}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default AsideBar;
