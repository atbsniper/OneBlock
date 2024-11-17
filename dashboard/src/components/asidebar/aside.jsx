import React, { useEffect } from "react";
import "./asidebar.css"; // Import the new CSS file
import { Link, useNavigate } from "react-router-dom";

function AsideBar() {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("loggedInUserLog");
    navigate("/");
  };

  useEffect(() => {
    const test = localStorage.getItem("loggedInUserLog");
    console.log(test);
    if (test === "admin") {
      // do nothing, user is admin
    } else {
      navigate("/");
    }
  }, [localStorage.getItem("loggedInUserLog")]);

  return (
    <div className="main-aside-wrapp">
      <h1 className="mt-3 text-center text-bold">One Block</h1>
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
  );
}

export default AsideBar;
