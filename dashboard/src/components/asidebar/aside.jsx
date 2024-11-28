import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./asidebar.css"; 

const AsideBar = () => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    // Remove user log from local storage
    localStorage.removeItem("loggedInUserLog");
    // Redirect to the homepage
    navigate("/");
  };

  useEffect(() => {
    // Check logged-in user from local storage
    const loggedInUser = localStorage.getItem("loggedInUserLog");
    console.log(loggedInUser);
    // Redirect to homepage if the user is not an admin
    if (loggedInUser !== "admin") {
      navigate("/");
    }
  }, [navigate]); // Dependency array with navigate to prevent unnecessary re-renders

  return (
    <aside className="main-aside-wrapp">
      <h1 className="mt-3 text-center text-bold">One Block</h1>
      <nav>
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
      </nav>
      <div className="logoutwrapp">
        <button className="btn" onClick={handleLogOut}>
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default AsideBar;
