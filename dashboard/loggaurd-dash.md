# .eslintrc.cjs

```cjs
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}

```

# .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

```

# index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ONEBLOCK Frontend</title>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
      integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
      crossorigin="anonymous"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
    <script
      src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.min.js"
      integrity="sha384-BBtl+eGJRgqQAUMxJ7pMwbEyER4l1g+O15P+16Ep7Q9Q+zqX6gSbd85u4mG4QzX+"
      crossorigin="anonymous"
    ></script>
  </body>
</html>

```

# package.json

```json
{
  "name": "oneblock",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@fortawesome/fontawesome-free": "^6.5.2",
    "@popperjs/core": "^2.11.8",
    "apexcharts": "^3.49.0",
    "axios": "^1.6.8",
    "bootstrap": "^5.3.2",
    "firebase": "^10.11.1",
    "react": "^18.2.0",
    "react-apexcharts": "^1.4.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0",
    "react-to-print": "^2.15.1",
    "sass": "^1.76.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "vite": "^5.2.0"
  }
}

```

# public\vite.svg

This is a file of the type: SVG Image

# README.md

```md
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

```

# src\App.css

```css
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
p,h1,h2,h3,h4,h5,h6{
  margin: 0;
  padding: 0;
}
.dashboard-main-wrapper {
  display: flex;
  height: 100%;
 
}
.dashboard-main-wrapper .content-area {
  /* padding-left: 20px; */
  width: 88%;
  height: 100vh;
  overflow-y: auto;
}

.after-content-wrap{
  padding: 20px;
}
```

# src\App.jsx

```jsx
import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import TeamPage from "./pages/teampage";
import DashboardPage from "./pages/dashboardpage";
import Login from "./components/login/login";
import Alerts from "./components/alerts/alerts";
import Report from "./components/logviewer/report";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          {/* <Route path="/team" element={<TeamPage />} /> */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/report" element={<Report />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;

```

# src\assets\react.svg

This is a file of the type: SVG Image

# src\bootstrap.d.ts

```ts
// src/bootstrap.d.ts
declare module 'bootstrap/dist/js/bootstrap.bundle.min.js';

```

# src\components\alerts\alerts.css

```css
/* alerts.css */

/* Styles for the Alerts component */
.alerts-component {
    display: flex;
  }
  
  .alerts-component .tables-starts {
  padding: 20px;
  background-color: #f9f9f900;
  border-radius: none;
  box-shadow: none;
  margin-left: 230px; /* Adjusted for the sidebar width */
  width: calc(100% - 230px); /* Adjusted for the sidebar width */
  height: calc(100vh - 40px); /* Adjust for top/bottom padding/margin */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Hide overflow to prevent horizontal scrolling */
  }
  
  .alerts-component .my-3 {
    margin-top: 1rem !important;
    margin-bottom: 1rem !important;
  }
  .transaction-hash {
    word-break: break-all; /* Break words at any character to prevent overflow */
  }
  .alerts-component .table-wrapper {
    overflow-y: auto; /* Allow vertical scrolling */
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    flex-grow: 1;
    overflow-x: auto; /* Allow horizontal scrolling */
  }
  
  .alerts-component .table-wrapper table {
    width: 100%; /* Make table width 100% */
    table-layout: auto; /* Auto table layout */
  }
  
  .alerts-component .table-wrapper table th,
  .alerts-component .table-wrapper table td {
    word-wrap: break-word; /* Break long words */
  }
  
  .alerts-component .table-wrapper .single-alert {
    margin-bottom: 10px;
    padding: 10px;
    border-bottom: 3px solid  #A0C49D;
    background-color: #f1f1f100;
    border-radius: 4px;
  }
  
  .alerts-component .table-wrapper .btn {
    margin: 5px;
    width: 100px;
    display: inline-block;
  }
  
  .alerts-component .table-wrapper .btn-success {
    background-color: #28a745;
    color: #fff;
    border: none;
  }
  
  .alerts-component .table-wrapper .btn-success:hover {
    background-color: #218838;
  }
  .pagination-nav {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    background-color: none;
  }
  
  .pagination {
    display: flex;
    list-style: none;
    padding: 0;
  }
  
  .page-item {
    margin: 0 5px;
  }
  
  .page-link {
    display: block;
    padding: 8px 12px;
    color: #000000;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .page-link:hover {
    background-color: #e9ecef;
  }
  
  .page-item.disabled .page-link {
    color: #6c757d;
    pointer-events: none;
    background-color: #fff;
    border-color: #dee2e6;
  }
  
  .page-item.active .page-link {
    z-index: 1;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
  }
/* Hide scrollbar for Chrome, Safari and Opera */
.table-wrapper::-webkit-scrollbar {
  display: none;
}


```

# src\components\alerts\alerts.jsx

```jsx
import React, { useEffect, useState } from "react";
import AsideBar from "../asidebar/aside";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./alerts.css";

function Alerts() {
  const [tableData, setTableData] = useState();
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;

  useEffect(() => {
    if (tableData) {
      console.log(tableData);
      setAlerts([]);
      let alertCount = 0;
      let attendenceCount = 0;
      let gradingCount = 0;

      const sortedData = [...tableData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const currentTimestamp = new Date();

      for (let i = 0; i < sortedData.length; i++) {
        const entry = sortedData[i];
        console.log(entry);
        if (entry?.type === "alert") {
          alertCount++;

          const alertTimestamp = new Date(entry.timestamp);
          const timeDifference = (currentTimestamp - alertTimestamp) / (1000 * 60 * 60);

          setAlerts((prev) => [...prev, entry]);
        } else if (entry?.action === "attendence") {
          attendenceCount++;
        } else if (entry?.action === "grading") {
          gradingCount++;
        }
      }

      console.log(alertCount);
      setAlertCount(alertCount);
      console.log(attendenceCount);
      console.log(gradingCount);
    }
  }, [tableData]);

  const getLogs = async () => {
    const url2 = `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`;
    console.log(url2);
    await axios
      .get(url2)
      .then((response) => {
        console.log(response.data.logs);
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          var parsedData1;
          var parsedData2;
          console.log(typeof parsedItem.data);
          if (typeof parsedItem.data == "string" && parsedItem.data != "") {
            console.log("here");
            parsedData1 = JSON.parse(parsedItem.data);
          }
          console.log(parsedItem.prevData != "");

          if (typeof parsedItem.prevData == "string" && parsedItem.prevData != "") {
            console.log("hamza");
            console.log(parsedItem.prevData.length);
            if (parsedItem.prevData.length == 0) {
              console.log("empty");
            } else {
              console.log("here");
              parsedData2 = JSON.parse(parsedItem.prevData);
              console.log(parsedData2);
            }
          }
          console.log(parsedData1);
          console.log(parsedData2);
          return {
            ...parsedItem,
            data: parsedData1,
            prevData: parsedData2,
            tokenId: item.tokenId,
          };
        });
        console.log(parsedData);
        setTableData(parsedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getLogs();
  }, []);

  const [transactionHash, setTransactionHash] = useState();

  const getTransactionHashes = async () => {
    const docRef = collection(db, "transactionHashes");
    var temp = {};

    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      temp[doc.id] = doc.data().transactionHash;
    });
    setTransactionHash(temp);
  };

  useEffect(() => {
    getTransactionHashes();
  }, []);

  useEffect(() => {
    console.log(transactionHash);
  }, [transactionHash]);

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);

  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      } else {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return (
      <>
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <a onClick={() => handleClick(currentPage - 1)} className="page-link">Previous</a>
        </li>
        {pageNumbers.map((number, index) =>
          typeof number === "number" ? (
            <li key={index} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <a onClick={() => handleClick(number)} className="page-link">{number}</a>
            </li>
          ) : (
            <li key={index} className="page-item">
              <span className="page-link">...</span>
            </li>
          )
        )}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <a onClick={() => handleClick(currentPage + 1)} className="page-link">Next</a>
        </li>
      </>
    );
  };

  return (
    <div className="alerts-component dashboard-main-wrapper">
      <AsideBar />
      <div className="tables-starts">
        <h3 className="my-3">Alert Descriptions</h3>
        <div className="table-wrapper">
          {currentAlerts &&
            currentAlerts.length > 0 &&
            currentAlerts.map((item, i) => {
              const handleDownload = () => {
                if (item.data) {
                  const data = JSON.stringify(item.data, null, 2);
                  const blob = new Blob([data], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "test.log";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              };

              const handleDownload2 = () => {
                if (item.prevData) {
                  const data = JSON.stringify(item.prevData, null, 2);
                  const blob = new Blob([data], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "test.log";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              };

              return (
                <div key={i}>
                  <p className="mt-0 mb-0 single-alert" style={{ fontWeight: 600 }}>
                    {indexOfFirstAlert + i + 1}
                    {": "}
                    <span className="font-bold">{item.teacherName}</span> with {item.ipAddress} (IP address) Changed the data from
                    {item.prevData ? (
                      <button className="btn btn-success m-3" onClick={handleDownload2}>
                        previous
                      </button>
                    ) : (
                      "-"
                    )}
                    with previous transaction hash:{" "}
                    <span className="transaction-hash">
                      {transactionHash && transactionHash[item.tokenId - 1] == undefined
                        ? "-"
                        : transactionHash && transactionHash[item.tokenId - 1]}{" "}
                    </span>
                    to new data
                    {item.data ? (
                      <button className="btn btn-success m-3" onClick={handleDownload}>
                        new
                      </button>
                    ) : (
                      "-"
                    )}
                    with new transaction hash:{" "}
                    <span className="transaction-hash">
                      {transactionHash && transactionHash[item.tokenId] == undefined
                        ? "-"
                        : transactionHash && transactionHash[item.tokenId]}
                    </span>
                  </p>
                </div>
              );
            })}
        </div>
        {alerts && alerts.length > alertsPerPage && (
          <nav className="pagination-nav">
            <ul className="pagination">
              {renderPagination()}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}

export default Alerts;

```

# src\components\asidebar\aside.jsx

```jsx
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

```

# src\components\asidebar\asidebar.css

```css
/* Sidebar Styles */
.main-aside-wrapp {
  width: 250px; /* Width of the sidebar */
  background: #1c1c1c;
  color: #fff;
  position: fixed;
  top: 0;
  left: -250px; /* Fully hidden initially */
  height: 100vh;
  border-right: 2px solid #333;
  padding: 20px;
  overflow-y: auto;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.3);
  transition: left 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
}

.main-aside-wrapp.active {
  left: 0; /* Visible when active */
}

.main-aside-wrapp h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 20px;
  text-align: center;
  color: #f8f9fa;
}

.main-aside-wrapp ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.main-aside-wrapp ul li {
  margin: 15px 0;
}

.main-aside-wrapp ul li a {
  color: #ccc;
  text-decoration: none;
  font-size: 18px;
  padding: 10px 15px;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.main-aside-wrapp ul li a:hover {
  background-color: #575757;
  color: #fff;
}

.logoutwrapp {
  position: absolute;
  bottom: 30px;
  left: 20px;
}

button.btn {
  padding: 10px 20px;
  color: #fff;
  background-color: #e74c3c;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn:hover {
  background-color: #c0392b;
}

/* Toggler Styles */
.sidebar-toggle {
  position: fixed;
  top: 5px;
  left: 5px;
  width: 50px;
  background: #1c1c1c;
  color: #fff;
  border: none;
  padding: 5px 5px;
  font-size: 12px;
  cursor: pointer;
  z-index: 1100;
  transition: all 0.3s ease;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.2);
}

.sidebar-toggle.active {
  left: 250px; /* Align with the sidebar */
}

.sidebar-toggle:hover {
  background: #333;
}

```

# src\components\banner\banner.css

```css
/* banner.css */
.university-banner {
    background-color: #1e354ed3;
    color: #faf0f0;
    padding: 20px 10px;
    height: 80px;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  
  .university-name {
    font-size: 50px;
    font-weight: bold;
    font-family: monospace;
    flex: 1; /* Allows the name to take up available space */
  }
  
  .university-logo {
    width: 150px;
    height: auto;
    margin-left: 20px; /* Add margin to separate from text */
  }
  
```

# src\components\banner\Banner.jsx

```jsx
// src/components/banner/Banner.jsx
import React from "react";
import airUniversityLogo from "./FASTLogo.png";
import "./banner.css"; // Ensure the correct path to CSS

const Banner = () => {
  return (
    <div className="university-banner">
      <span className="university-name">FAST NUCES - Islamabad</span>
      <img src={airUniversityLogo} alt="FAST NUCES Logo" className="university-logo" />
    </div>
  );
};

export default Banner;

```

# src\components\banner\FASTLogo.png

This is a binary file of the type: Image

# src\components\dashboard\dashboard copy.jsx

```jsx
import React, { useEffect, useState } from "react";
import "./dashboard.css";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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
      categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    },
  });

  const [showAllLogs, setShowAllLogs] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [pieChartOptions, setPieChartOptions] = useState({
    chart: {
      type: "pie",
    },
    series: [0, 0],
    labels: ["Attendance", "Grading"],
  });
  const [alertCount, setAlertCount] = useState(0);
  const [transactionHash, setTransactionHash] = useState({});

  const getLogs = async () => {
    const url2 = `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`;
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
        uniqueDates = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => `${day} (${month})`);
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
      let attendanceCount = 0;
      let gradingCount = 0;

      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i]?.type === "alert") {
          alertCount++;
        }
        if (tableData[i]?.action === "attendance") {
          attendanceCount++;
        }
        if (tableData[i]?.action === "grading") {
          gradingCount++;
        }
      }
      console.log(alertCount);
      setAlertCount(alertCount);
      console.log(attendanceCount);
      console.log(gradingCount);

      const actionCounts = {
        Attendance: attendanceCount,
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

  return (
    <div className="dashboard-main-component">
      <div className="graph-container">
        <div className="single-graph">
          <div className="graph-header">
            <h3>Total logs</h3>
            <div className="dropdown view-mode-dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                View Mode
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => setViewMode("daily")}>Daily</button></li>
                <li><button className="dropdown-item" onClick={() => setViewMode("weekly")}>Weekly</button></li>
                <li><button className="dropdown-item" onClick={() => setViewMode("monthly")}>Monthly</button></li>
              </ul>
            </div>
          </div>
          <h3>{tableData.length}</h3>
          <ReactApexChart
            options={options}
            series={options.series}
            type="bar"
            height={400}
          />
        </div>
        <div className="single-graph">
          <h3>Total Alerts</h3>
          <h3>{alertCount}</h3>
          <ReactApexChart
            options={pieChartOptions}
            series={pieChartOptions.series}
            type="pie"
            height={400}
          />
        </div>
      </div>

      <div className="tables-starts">
        <h3 className="my-3">Log Entries</h3>
        <div className="table-wrapper">
          <table className="table table-modern table-hover">
            <thead>
              <tr>
                
                <th scope="col">Time</th>
                <th scope="col">Ip Address</th>
                <th scope="col">Log</th>
                <th scope="col">Browser</th>
                <th scope="col">Teacher Name</th>
                <th scope="col">Action</th>
                <th scope="col">Type</th>
                <th scope="col">Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {tableData &&
                tableData.length > 0 &&
                tableData.slice().reverse().slice(showAllLogs ? 0 : 0, showAllLogs ? tableData.length : 5).map((item, i) => {
                  const handleDownload = () => {
                    if (item.data) {
                      const data = JSON.stringify(item.data, null, 2);
                      const blob = new Blob([data], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "test.log";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  };

                  return (
                    <tr key={i}>
                
                      <td>{item.timestamp}</td>
                      <td>{item.ipAddress}</td>
                      <td>
                        {item.data ? (
                          <button className="btn btn-success" onClick={handleDownload}>
                            log
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{item.detectedBrowser}</td>
                      <td>{item.teacherName}</td>
                      <td>{item.action}</td>
                      <td>{item?.type ? item.type : "-"}</td>
                      <td className="transaction-hash">
                        {transactionHash && transactionHash[item.tokenId] === undefined
                          ? "-"
                          : transactionHash && transactionHash[item.tokenId]}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!showAllLogs && tableData && tableData.length > 5 && (
            <button className="btn btn-success" onClick={() => setShowAllLogs(true)}>
              See More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

```

# src\components\dashboard\dashboard.css

```css
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
  display: flex;
  overflow: hidden; /* Remove scrollbars */
}

.dashboard-main-component {
  padding: 20px;
  flex-grow: 1;
  background-color: #ffffff00;
  margin-left: 530px; 
  margin-right: 290px;
  margin-top: 0px;
  width: 150vh;
}

.graph-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.single-graph {
  flex: 1;
  min-width: 300px;
  box-shadow: 0px 0px 10px 10px #00000008;
  padding: 20px;
  border-radius: 10px;
  background-color: #fff;
  margin-bottom: 20px;
}

.single-graph h3 {
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.tables-starts {
  box-shadow: 0px 0px 10px 10px #00000008;
  padding: 20px;
  border-radius: 10px;
  background-color: #ffffff;
  margin-top: 10px;
  overflow-x: auto; /* Added to handle horizontal overflow */
}

.table-wrapper {
  width: 100%;
  overflow-x: auto; /* Ensures the table fits within the wrapper */
}

table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed; /* Ensures fixed layout for columns */
}

th, td {
  border-bottom: 1px solid #ddd;
  white-space: nowrap; /* Prevents text from wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Adds ellipsis for overflowing text */
}

th {
  padding: 15px 10px; /* Adjust padding for headers as needed */
  background-color: #ffffff;
}

td {
  padding: 10px; /* Adjust padding for data cells as needed */
  max-width: 200px; /* Adjust as needed */
}


th:nth-child(1), td:nth-child(2) {
  width: 170px; /* Adjust width for 'type' column */
}

th:nth-child(2), td:nth-child(3) {
  width: 150px; /* Adjust width for 'type' column */
  
}

th:nth-child(3), td:nth-child(4) {
  width: 130px; /* Adjust width for 'type' column */
}

th:nth-child(4), td:nth-child(5) {
  width: 170px; /* Adjust width for 'type' column */
}

th:nth-child(5), td:nth-child(6) {
  width: 150px; /* Adjust width for 'type' column */
}

th:nth-child(6), td:nth-child(7) {
  width: 120px; /* Adjust width for 'type' column */
}

th:nth-child(7), td:nth-child(8) {
  width: 100px; /* Adjust width for 'type' column */
}

th:nth-child(8), td:nth-child(9) {
  width: 300px; /* Adjust width for 'Transaction Hash' column */
}

.tables-starts h3 {
  margin-bottom: 20px;
  color: #333;
  font-weight: bold;
}

.main-aside-wrapp {
  width: 250px; /* Fixed width for the sidebar */
  background: black;
  color: white;
  height: 100vh; /* Full height */
  position: fixed; /* Fixed position */
  top: 0;
  left: 0;
  border-radius: 0; /* Remove border radius */
  padding: 20px;
}

.main-aside-wrapp h1 {
  font-size: 25px;
  font-weight: 900;
  margin: 10px 0;
  text-align: center;
}

.main-aside-wrapp ul {
  padding-top: 50px;
  list-style-type: none;
  padding-left: 0;
}

.main-aside-wrapp ul li {
  margin-top: 10px;
}

.main-aside-wrapp ul li a {
  color: white;
  text-decoration: none;
  font-weight: 700;
}

.main-aside-wrapp ul li a:hover {
  text-decoration: underline;
}

.logoutwrapp {
  position: absolute;
  bottom: 30px;
  left: 20px;
}

button.btn {
  padding: 10px 20px;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button.btn:hover {
  background-color: #28a745;
}

@media (max-width: 768px) {
  .main-aside-wrapp {
    width: 100%;
    height: auto;
    position: relative;
  }

  .dashboard-main-component {
    margin-left: 0;
    width: 100%;
  }
}
.graph-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-mode-dropdown {
  position: relative;
  top: 50px; /* Adjust as needed */
  right: 0px; /* Adjust as needed */
}

```

# src\components\dashboard\dashboard.jsx

```jsx
import React, { useEffect, useState } from "react";
import "./dashboard.css";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

  const getLogs = async () => {
    const url2 = `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`;
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

  return (
    <div className="dashboard-main-component">
      <div className="graph-container">
        <div className="single-graph">
          <div className="graph-header">
            <h3>Total logs</h3>
            <div className="dropdown view-mode-dropdown">
              <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                View Mode
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => setViewMode("daily")}>Daily</button></li>
                <li><button className="dropdown-item" onClick={() => setViewMode("weekly")}>Weekly</button></li>
                <li><button className="dropdown-item" onClick={() => setViewMode("monthly")}>Monthly</button></li>
              </ul>
            </div>
          </div>
          <h3>{tableData.length}</h3>
          <ReactApexChart
            options={options}
            series={options.series}
            type="bar"
            height={400}
          />
        </div>
        <div className="single-graph">
          <h3>Total Alerts</h3>
          <h3>{alertCount}</h3>
          <ReactApexChart
            options={pieChartOptions}
            series={pieChartOptions.series}
            type="pie"
            height={400}
          />
        </div>
      </div>

      <div className="tables-starts">
        <h3 className="my-3">Log Entries</h3>
        <div className="table-wrapper">
          <table className="table table-modern table-hover">
            <thead>
              <tr>
                
                <th scope="col">Time</th>
                <th scope="col">Ip Address</th>
                <th scope="col">Log</th>
                <th scope="col">Browser</th>
                <th scope="col">Teacher Name</th>
                <th scope="col">Action</th>
                <th scope="col">Type</th>
                <th scope="col">Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {tableData &&
                tableData.length > 0 &&
                tableData.slice().reverse().slice(showAllLogs ? 0 : 0, showAllLogs ? tableData.length : 5).map((item, i) => {
                  const handleDownload = () => {
                    if (item.data) {
                      const data = JSON.stringify(item.data, null, 2);
                      const blob = new Blob([data], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = "test.log";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }
                  };

                  return (
                    <tr key={i}>
                      
                      <td>{item.timestamp}</td>
                      <td>{item.ipAddress}</td>
                      <td>
                        {item.data ? (
                          <button className="btn btn-success" onClick={handleDownload}>
                            log
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>{item.detectedBrowser}</td>
                      <td>{item.teacherName}</td>
                      <td>{item.action}</td>
                      <td>{item?.type ? item.type : "-"}</td>
                      <td className="transaction-hash">
                        {transactionHash && transactionHash[item.tokenId] === undefined
                          ? "-"
                          : transactionHash && transactionHash[item.tokenId]}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!showAllLogs && tableData && tableData.length > 5 && (
            <button className="btn btn-success" onClick={() => setShowAllLogs(true)}>
              See More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

```

# src\components\login\admin.png

This is a binary file of the type: Image

# src\components\login\login.css

```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Courier New', Courier, monospace;
  background: linear-gradient(to right, #A0C49D, #C4D7B2, #E1ECC8, #A0C49D); 
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login-container {
  display: flex;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  width: 1200px; /* Increased width */
  overflow: hidden;
}

.left-section, .right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #27374D; /* Same background for both sections */
}

.login-image {
  max-width: 80%;
  max-height: 80%;
  object-fit: contain; /* Ensures the image is centered and fits well */
}

.divider {
  width: 1px; /* Reduced width */
  background: #ccc; /* Ensure the line is visible */
  height: 50%; /* Adjust height to reduce the length of the line */
  margin: auto 0;
}

.right-section {
  flex-direction: column; /* Align items vertically */
  padding: 40px;
}

.logo img {
  display: block;
  margin: 0 auto 20px;
  width: 200px;
}

h2 {
  margin: 25px 0;
  color: #ffffff;
  position: relative;
  font-size: large;
  padding-right: 410px;
  font-weight: bold;
}

h2::before {
  content: '';
  position: absolute;
  left: 0px; /* Adjust this value to align with the input boxes */
  top: -20px;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, #A0C49D, #C4D7B2, #E1ECC8, #A0C49D);
}

.input-container {
  width: 100%; /* Ensure inputs take full width */
  margin: 0px;
  position: relative;
}

.input-container input {
  width: 100%;
  padding: 15px 50px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
  background: #f9f9f9;
}

.input-container .icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #ccc;
}

.input-container .icon-user {
  left: 20px;
}

.input-container .icon-lock {
  left: 20px;
}

button {
  width: 100%;
  padding: 15px;
  background: #A0C49D;
  border: none;
  border-radius: 25px;
  color: black;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: 20px;
  font-weight: bold;
}

button:hover {
  background: #C4D7B2;
}

.error-message {
  color: red;
  text-align: center;
  margin-top: 10px;
}

```

# src\components\login\login.jsx

```jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdmin } from "../../firebase/firebaseConfig";
import "./login.css"; // Updated to .css
import logo from './oneblocklogo.webp'; // Import the logo image
import admin from './admin.png'; // Import the login illustration
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminDetails, setAdminDetails] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === "") {
      setError("Please Enter Username");
      return;
    }
    if (password === "") {
      setError("Please Enter Password");
      return;
    }
    if (
      username === adminDetails.username &&
      password === adminDetails.password
    ) {
      localStorage.setItem("loggedInUserLog", username);
      navigate("/dashboard");
      return;
    } else {
      setError("Invalid Username or Password");
      return;
    }
  };

  useEffect(() => {
    if (localStorage.getItem("loggedInUserLog") === "admin") {
      navigate("/dashboard");
    } else {
      console.log("test");
    }
  }, [localStorage.getItem("loggedInUserLog")]);

  useEffect(() => {
    const getAdminData = async () => {
      const test = await getAdmin();
      console.log(test);
      setAdminDetails(test);
    };
    getAdminData();
  }, []);

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={admin} alt="admin" className="login-image" /> 
      </div>
      <div className="divider"></div>
      <div className="right-section">
        <div className="logo">
          <img src={logo} alt="Company Logo" /> 
        </div>
        <h2>Login Here!</h2>
        <div className="input-container">
          <i className="fas fa-user icon icon-user"></i>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container">
          <i className="fas fa-lock icon icon-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;

```

# src\components\login\oneblocklogo.webp

This is a binary file of the type: Image

# src\components\logviewer\report copy 2.jsx

```jsx

import React, { useEffect, useState, useRef } from "react";
import AsideBar from "../asidebar/aside";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./report.css";
import ReactToPrint from "react-to-print";

function Alerts() {
  const [tableData, setTableData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [transactionHash, setTransactionHash] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 25;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`
        );
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          let parsedData1;
          let parsedData2;
          if (typeof parsedItem.data === "string" && parsedItem.data !== "") {
            parsedData1 = JSON.parse(parsedItem.data);
          }
          if (
            typeof parsedItem.prevData === "string" &&
            parsedItem.prevData !== ""
          ) {
            if (parsedItem.prevData.length !== 0) {
              parsedData2 = JSON.parse(parsedItem.prevData);
            }
          }
          return {
            ...parsedItem,
            data: parsedData1,
            prevData: parsedData2,
            tokenId: item.tokenId,
          };
        });
        setTableData(parsedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const processTableData = () => {
      let alertCount = 0;
      let attendanceCount = 0;
      let gradingCount = 0;

      const alertsByHour = {};

      tableData.forEach((entry) => {
        if (entry?.type === "alert") {
          alertCount++;
          const alertTimestamp = new Date(entry.timestamp);
          const hourDifference = Math.floor(
            (new Date() - alertTimestamp) / (1000 * 60 * 60)
          );
          alertsByHour[hourDifference] =
            (alertsByHour[hourDifference] || 0) + 1;
          setAlerts((prev) => [...prev, entry]);
        } else if (entry?.action === "attendance") {
          attendanceCount++;
        } else if (entry?.action === "grading") {
          gradingCount++;
        }
      });

      setAlertCount(alertCount);
    };

    if (tableData.length > 0) {
      setAlerts([]);
      processTableData();
    }
  }, [tableData]);

  useEffect(() => {
    if (alerts.length > 0) {
      const uniqueMonthsYears = [
        ...new Set(
          alerts.map((item) => {
            const [year, month] = item.timestamp.split("-").slice(0, 2);
            return `${month}-${year}`;
          })
        ),
      ];

      const seriesData = uniqueMonthsYears.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return alerts.reduce((count, item) => {
          const [itemYear, itemMonth] = item.timestamp.split("-").slice(0, 2);
          if (itemYear === year && itemMonth === month) {
            return count + 1;
          }
          return count;
        }, 0);
      });
    }
  }, [alerts]);

  

  useEffect(() => {
    let filtered = alerts;

    if (teacherFilter) {
      filtered = filtered.filter((alert) =>
        alert.teacherName.toLowerCase().includes(teacherFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((alert) =>
        alert.action.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, teacherFilter, typeFilter]);

  useEffect(() => {
    const getTransactionHashes = async () => {
      const docRef = collection(db, "transactionHashes");
      const temp = {};

      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        temp[doc.id] = doc.data().transactionHash;
      });
      setTransactionHash(temp);
    };

    getTransactionHashes();
  }, []);

  const getChangedData = (newData, prevData) => {
    const changes = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        changes[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return changes;
  };

  const getChangedGrade = (newData, prevData) => {
    const Gradechanges = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        Gradechanges[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return Gradechanges;
  };

  const filterChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const filterGradeChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const handleDownloadChangedData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedGrade(item.data, item.prevData);
      const data = JSON.stringify(changedData, null, 2);
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "changed_data.log";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleViewGradeData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedGrade(item.data, item.prevData);
      const filteredData1 = Object.keys(changedData);
  
      const columnsToDisplay = {
        mid: false,
        assignment: false,
        quiz: false,
        final: false,
      };
  
      filteredData1.forEach((key) => {
        if (changedData[key]?.old?.mid || changedData[key]?.new?.mid)
          columnsToDisplay.mid = true;
        if (
          changedData[key]?.old?.assignment?.some((a) => a) ||
          changedData[key]?.new?.assignment?.some((a) => a)
        )
          columnsToDisplay.assignment = true;
        if (
          changedData[key]?.old?.quiz?.some((q) => q) ||
          changedData[key]?.new?.quiz?.some((q) => q)
        )
          columnsToDisplay.quiz = true;
        if (changedData[key]?.old?.final || changedData[key]?.new?.final)
          columnsToDisplay.final = true;
      });
  
      setModalData(
        <div>
          
          <div ref={componentRef} style={{ marginLeft: "50px", marginRight: "50px" }}>
            <h2 style={{ textAlign: "center" }}>Grade Data Report</h2>
            <h3 style={{ textAlign: "center" }}>Detailed Grade Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <table className="report-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "8px" }}>#</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Student ID</th>
                  {columnsToDisplay.mid && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Midterm (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Midterm (New)</th>
                    </>
                  )}
                  {columnsToDisplay.assignment && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Assignments (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Assignments (New)</th>
                    </>
                  )}
                  {columnsToDisplay.quiz && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Quizzes (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Quizzes (New)</th>
                    </>
                  )}
                  {columnsToDisplay.final && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Final (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Final (New)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData1.map((key, index) => (
                  <tr key={key}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{key}</td>
                    {columnsToDisplay.mid && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.mid ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.mid ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.assignment && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.assignment?.join(", ") ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.assignment?.join(", ") ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.quiz && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.quiz?.join(", ") ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.quiz?.join(", ") ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.final && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.final ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.final ?? ''}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: logguard@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success" onClick={handlePrint} style={{ marginTop: "16px" }}>Print</button>}
            content={() => componentRef.current}
          />
        </div>
      );
      setModalVisible(true);
    }
  };
  

  const componentRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleViewAttendanceData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedData(item.data, item.prevData);
      const filteredData = filterChangedEntries(changedData);
      const filteredData1 = Object.keys(filteredData);
  
      setModalData(
        <div>
          <div ref={componentRef} style={{ marginLeft: "50px", marginRight: "50px" }}>
            <h2 style={{ textAlign: "center" }}>Attendance Data Report</h2>
            <h3 style={{ textAlign: "center" }}>Detailed Attendance Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <table className="report-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "8px" }}>#</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Roll Number</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Old Present Status</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>New Present Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData1.map((key, index) => (
                  <tr key={key}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{key}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].new.name}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].old.isPresent.toString()}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].new.isPresent.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: logguard@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success" onClick={handlePrint} style={{ marginTop: "16px" }}>Print</button>}
            content={() => componentRef.current}
          />
        </div>
      );
      setModalVisible(true);
    }
  };
  
  

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredAlerts.slice(indexOfFirstLog, indexOfLastLog);
  const reversedLogs = [...currentLogs].reverse();
  const totalPages = Math.ceil(filteredAlerts.length / logsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      } else {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return (
      <>
        <li className={`report-page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => handleClick(currentPage - 1)}>
          Previous
        </li>
        {pageNumbers.map((number, index) =>
          typeof number === "number" ? (
            <li key={index} className={`report-page-item ${currentPage === number ? 'active' : ''}`} onClick={() => handleClick(number)}>
              {number}
            </li>
          ) : (
            <li key={index} className="report-page-item">...</li>
          )
        )}
        <li className={`report-page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => handleClick(currentPage + 1)}>
          Next
        </li>
      </>
    );
  };

  return (
    <div className="report-dashboard-main-wrapper">
      <AsideBar />
      <div className="report-content-area">
        <div className="report-after-content-wrap">
          <div className="report-alerts-main">
            <div className="report-filter-heading">Filters</div>
            <div className="report-filters">
              <input
                type="text"
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                placeholder="Filter by Teacher Name"
              />
              <input
                type="text"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                placeholder="Filter by Action"
              />
            </div>

            <div className="report-tables-starts">
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Teacher Name</th>
                      <th>Action</th>
                      <th>IP Address</th>
                      <th>Previous Data</th>
                      <th>Previous Hash</th>
                      <th>New Data</th>
                      <th>New Hash</th>
                      <th>View Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reversedLogs.map((item, i) => {
                      const handleDownload = () => {
                        if (item.data) {
                          const data = JSON.stringify(item.data, null, 2);
                          const blob = new Blob([data], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "new_data.log";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      };

                      const handleDownload2 = () => {
                        if (item.prevData) {
                          const data = JSON.stringify(item.prevData, null, 2);
                          const blob = new Blob([data], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "prev_data.log";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      };

                      if (item.data && item.prevData) {
                        const changedData = getChangedData(item.data, item.prevData);
                        if (Object.keys(changedData).length === 0) {
                          return null; // Skip rendering this row
                        }
                      }

                      return (
                        <tr key={i}>
                          <td>{indexOfFirstLog + i + 1}</td>
                          <td>{item.teacherName}</td>
                          <td>{item.action}</td>
                          <td>{item.ipAddress}</td>
                          <td>
                            {item.data ? (
                              <button className="report-btn report-btn-success" onClick={handleDownload}>
                                Previous
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {transactionHash && transactionHash[item.tokenId - 1] === undefined
                              ? "-"
                              : transactionHash && transactionHash[item.tokenId - 1]}
                          </td>
                          <td>
                            {item.prevData ? (
                              <button className="report-btn report-btn-success" onClick={handleDownload2}>
                                New
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {transactionHash && transactionHash[item.tokenId] === undefined
                              ? "-"
                              : transactionHash && transactionHash[item.tokenId]}
                          </td>
                          <td>
                            <div className="report-btn-group" role="group" aria-label="View Data">
                              {item.action === "grading" && (
                                <button className="report-btn report-btn-primary" onClick={() => handleViewGradeData(item)}>
                                  View Grade Data
                                </button>
                              )}
                              {item.action === "attendence" && (
                                <button className="report-btn report-btn-primary" onClick={() => handleViewAttendanceData(item)}>
                                  View Attendance Data
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredAlerts.length > logsPerPage && (
                  <nav className="report-pagination-nav">
                    <ul className="report-pagination">
                      {renderPagination()}
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="report-modal">
          <div className="report-modal-content">
            <span className="report-close" onClick={() => setModalVisible(false)}>
              &times;
            </span>
            <pre>{modalData}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;

```

# src\components\logviewer\report copy.jsx

```jsx

import React, { useEffect, useState, useRef } from "react";
import AsideBar from "../asidebar/aside";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./report.css";
import ReactToPrint from "react-to-print";
import Banner from "../banner/Banner";

function Alerts() {
  const [tableData, setTableData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [transactionHash, setTransactionHash] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 25;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`
        );
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          let parsedData1;
          let parsedData2;
          if (typeof parsedItem.data === "string" && parsedItem.data !== "") {
            parsedData1 = JSON.parse(parsedItem.data);
          }
          if (
            typeof parsedItem.prevData === "string" &&
            parsedItem.prevData !== ""
          ) {
            if (parsedItem.prevData.length !== 0) {
              parsedData2 = JSON.parse(parsedItem.prevData);
            }
          }
          return {
            ...parsedItem,
            data: parsedData1,
            prevData: parsedData2,
            tokenId: item.tokenId,
          };
        });
        setTableData(parsedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const processTableData = () => {
      let alertCount = 0;
      let attendanceCount = 0;
      let gradingCount = 0;

      const alertsByHour = {};

      tableData.forEach((entry) => {
        if (entry?.type === "alert") {
          alertCount++;
          const alertTimestamp = new Date(entry.timestamp);
          const hourDifference = Math.floor(
            (new Date() - alertTimestamp) / (1000 * 60 * 60)
          );
          alertsByHour[hourDifference] =
            (alertsByHour[hourDifference] || 0) + 1;
          setAlerts((prev) => [...prev, entry]);
        } else if (entry?.action === "attendance") {
          attendanceCount++;
        } else if (entry?.action === "grading") {
          gradingCount++;
        }
      });

      setAlertCount(alertCount);
    };

    if (tableData.length > 0) {
      setAlerts([]);
      processTableData();
    }
  }, [tableData]);

  useEffect(() => {
    if (alerts.length > 0) {
      const uniqueMonthsYears = [
        ...new Set(
          alerts.map((item) => {
            const [year, month] = item.timestamp.split("-").slice(0, 2);
            return `${month}-${year}`;
          })
        ),
      ];

      const seriesData = uniqueMonthsYears.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return alerts.reduce((count, item) => {
          const [itemYear, itemMonth] = item.timestamp.split("-").slice(0, 2);
          if (itemYear === year && itemMonth === month) {
            return count + 1;
          }
          return count;
        }, 0);
      });
    }
  }, [alerts]);

  

  useEffect(() => {
    let filtered = alerts;

    if (teacherFilter) {
      filtered = filtered.filter((alert) =>
        alert.teacherName.toLowerCase().includes(teacherFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((alert) =>
        alert.action.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, teacherFilter, typeFilter]);

  useEffect(() => {
    const getTransactionHashes = async () => {
      const docRef = collection(db, "transactionHashes");
      const temp = {};

      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        temp[doc.id] = doc.data().transactionHash;
      });
      setTransactionHash(temp);
    };

    getTransactionHashes();
  }, []);

  const getChangedData = (newData, prevData) => {
    const changes = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        changes[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return changes;
  };

  const getChangedGrade = (newData, prevData) => {
    const Gradechanges = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        Gradechanges[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return Gradechanges;
  };

  const filterChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const filterGradeChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const handleDownloadChangedData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedGrade(item.data, item.prevData);
      const data = JSON.stringify(changedData, null, 2);
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "changed_data.log";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleViewGradeData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedGrade(item.data, item.prevData);
      const filteredData1 = Object.keys(changedData);
  
      const columnsToDisplay = {
        mid: false,
        assignment: false,
        quiz: false,
        final: false,
      };
  
      filteredData1.forEach((key) => {
        if (changedData[key]?.old?.mid || changedData[key]?.new?.mid)
          columnsToDisplay.mid = true;
        if (
          changedData[key]?.old?.assignment?.some((a) => a) ||
          changedData[key]?.new?.assignment?.some((a) => a)
        )
          columnsToDisplay.assignment = true;
        if (
          changedData[key]?.old?.quiz?.some((q) => q) ||
          changedData[key]?.new?.quiz?.some((q) => q)
        )
          columnsToDisplay.quiz = true;
        if (changedData[key]?.old?.final || changedData[key]?.new?.final)
          columnsToDisplay.final = true;
      });
  
      setModalData(
        <div>
          
          <div ref={componentRef} style={{ marginLeft: "50px", marginRight: "50px" }}>
            <h2 style={{ textAlign: "center" }}>Grade Data Report</h2>
            <h3 style={{ textAlign: "center" }}>Detailed Grade Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <table className="report-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "8px" }}>#</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Student ID</th>
                  {columnsToDisplay.mid && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Midterm (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Midterm (New)</th>
                    </>
                  )}
                  {columnsToDisplay.assignment && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Assignments (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Assignments (New)</th>
                    </>
                  )}
                  {columnsToDisplay.quiz && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Quizzes (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Quizzes (New)</th>
                    </>
                  )}
                  {columnsToDisplay.final && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Final (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Final (New)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData1.map((key, index) => (
                  <tr key={key}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{key}</td>
                    {columnsToDisplay.mid && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.mid ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.mid ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.assignment && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.assignment?.join(", ") ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.assignment?.join(", ") ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.quiz && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.quiz?.join(", ") ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.quiz?.join(", ") ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.final && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.final ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.final ?? ''}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: logguard@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success" onClick={handlePrint} style={{ marginTop: "16px" }}>Print</button>}
            content={() => componentRef.current}
          />
        </div>
      );
      setModalVisible(true);
    }
  };
  

  const componentRef = useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleViewAttendanceData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedData(item.data, item.prevData);
      const filteredData = filterChangedEntries(changedData);
      const filteredData1 = Object.keys(filteredData);
  
      setModalData(
        <div>
          <div ref={componentRef} style={{ marginLeft: "50px", marginRight: "50px" }}>
            <h2 style={{ textAlign: "center" }}>Attendance Data Report</h2>
            <h3 style={{ textAlign: "center" }}>Detailed Attendance Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <table className="report-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "8px" }}>#</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Roll Number</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Old Present Status</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>New Present Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData1.map((key, index) => (
                  <tr key={key}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{key}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].new.name}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].old.isPresent.toString()}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].new.isPresent.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: logguard@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success" onClick={handlePrint} style={{ marginTop: "16px" }}>Print</button>}
            content={() => componentRef.current}
          />
        </div>
      );
      setModalVisible(true);
    }
  };
  
  

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredAlerts.slice(indexOfFirstLog, indexOfLastLog);
  const reversedLogs = [...currentLogs].reverse();
  const totalPages = Math.ceil(filteredAlerts.length / logsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      } else {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return (
      <>
        <li className={`report-page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => handleClick(currentPage - 1)}>
          Previous
        </li>
        {pageNumbers.map((number, index) =>
          typeof number === "number" ? (
            <li key={index} className={`report-page-item ${currentPage === number ? 'active' : ''}`} onClick={() => handleClick(number)}>
              {number}
            </li>
          ) : (
            <li key={index} className="report-page-item">...</li>
          )
        )}
        <li className={`report-page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => handleClick(currentPage + 1)}>
          Next
        </li>
      </>
    );
  };

  return (
    <div className="report-dashboard-main-wrapper">
      <AsideBar />
      <div className="report-content-area">
        <div className="report-after-content-wrap">
          <div className="report-alerts-main">
            <div className="report-filter-heading">Filters</div>
            <div className="report-filters">
              <input
                type="text"
                value={teacherFilter}
                onChange={(e) => setTeacherFilter(e.target.value)}
                placeholder="Filter by Teacher Name"
              />
              <input
                type="text"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                placeholder="Filter by Action"
              />
            </div>

            <div className="report-tables-starts">
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Teacher Name</th>
                      <th>Action</th>
                      <th>IP Address</th>
                      <th>Previous Data</th>
                      <th>Previous Hash</th>
                      <th>New Data</th>
                      <th>New Hash</th>
                      <th>View Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reversedLogs.map((item, i) => {
                      const handleDownload = () => {
                        if (item.data) {
                          const data = JSON.stringify(item.data, null, 2);
                          const blob = new Blob([data], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "new_data.log";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      };

                      const handleDownload2 = () => {
                        if (item.prevData) {
                          const data = JSON.stringify(item.prevData, null, 2);
                          const blob = new Blob([data], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = "prev_data.log";
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      };

                      if (item.data && item.prevData) {
                        const changedData = getChangedData(item.data, item.prevData);
                        if (Object.keys(changedData).length === 0) {
                          return null; // Skip rendering this row
                        }
                      }

                      return (
                        <tr key={i}>
                          <td>{indexOfFirstLog + i + 1}</td>
                          <td>{item.teacherName}</td>
                          <td>{item.action}</td>
                          <td>{item.ipAddress}</td>
                          <td>
                            {item.data ? (
                              <button className="report-btn report-btn-success" onClick={handleDownload}>
                                Previous
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {transactionHash && transactionHash[item.tokenId - 1] === undefined
                              ? "-"
                              : transactionHash && transactionHash[item.tokenId - 1]}
                          </td>
                          <td>
                            {item.prevData ? (
                              <button className="report-btn report-btn-success" onClick={handleDownload2}>
                                New
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>
                            {transactionHash && transactionHash[item.tokenId] === undefined
                              ? "-"
                              : transactionHash && transactionHash[item.tokenId]}
                          </td>
                          <td>
                            <div className="report-btn-group" role="group" aria-label="View Data">
                              {item.action === "grading" && (
                                <button className="report-btn report-btn-primary" onClick={() => handleViewGradeData(item)}>
                                  View Grade Data
                                </button>
                              )}
                              {item.action === "attendence" && (
                                <button className="report-btn report-btn-primary" onClick={() => handleViewAttendanceData(item)}>
                                  View Attendance Data
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredAlerts.length > logsPerPage && (
                  <nav className="report-pagination-nav">
                    <ul className="report-pagination">
                      {renderPagination()}
                    </ul>
                  </nav>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="report-modal">
          <div className="report-modal-content">
            <span className="report-close" onClick={() => setModalVisible(false)}>
              &times;
            </span>
            <pre>{modalData}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;

```

# src\components\logviewer\report.css

```css
/* Main wrapper and content area */
.report-dashboard-main-wrapper {
    display: flex;
    height: 100vh;
}

.report-content-area {
    flex: 1;
    overflow-y: auto;
}

.report-after-content-wrap {
    padding: 20px;
}

/* Alerts section styling */
.report-alerts-main {
    background-color: #f9f9f900;
    border-radius: none;
    box-shadow: none;
    padding: 20px;
    margin-left: 230px;
    width: calc(100% - 230px);
    height: calc(100vh - 40px);
    display: flex;
    flex-direction: column;
}

.report-filters-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.report-filter-heading {
    margin-right: 370px;
    font-weight: bold;
    font-size: x-large;
}

.report-filters {
    display: flex;
    justify-content: flex-end;
    gap: 20px;
    margin-bottom: 0px;
    margin-right: 22px;
    width: 540px;
}

.report-filters input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white; /* Set input background to white */
    width: 250px;
}

/* Table and pagination styling */
.report-tables-starts {
    margin-top: 0px;
    flex-grow: 1;
}

.report-header h3{
    font-size: 34px;        /* Font size of the heading */
    font-weight: bold;      /* Make the font bold */
    color: #333;            /* Text color */
    margin-bottom: 0px;    /* Space below the heading */
    text-align: left;     /* Center the heading text */
    margin-left: 30px;
}
.report-table-wrapper {
    overflow-y: auto;
    background-color: #ffffff00;
    padding: 20px;
    border-radius: none;
    box-shadow: none;
    overflow-x: auto;
    margin-left: -140px;
    width: 105%;
}

/* Table styling */
.report-table {
    width: 100%;
    border-collapse: collapse;
}

.report-table th,
.report-table td {
    padding: 8px;
    text-align: left;
    word-wrap: break-word;
    background-color: white; /* Set cell background to white */
}

/* Individual header styling */
.report-table th:nth-child(1), .report-table td:nth-child(1) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 50px;
}
.report-table th:nth-child(2), .report-table td:nth-child(2) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 170px;
}
.report-table th:nth-child(3), .report-table td:nth-child(3) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 150px;
}
.report-table th:nth-child(4), .report-table td:nth-child(4) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 100px;
}
.report-table th:nth-child(5), .report-table td:nth-child(5) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 180px;
}
.report-table th:nth-child(6), .report-table td:nth-child(6) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 130px;
}
.report-table th:nth-child(7), .report-table td:nth-child(7) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 210px;
}
.report-table th:nth-child(8), .report-table td:nth-child(8) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 170px;
}
.report-table th:nth-child(9), .report-table td:nth-child(9) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 210px;
}
.report-table th:nth-child(10), .report-table td:nth-child(10) {
    font-size: 18px; /* Change size as needed */
    padding: 12px;
    width: 240px;
}
/* Table row styling */
.report-table th {
    background-color: #1a1a1a;
    color: white;
}
.report-table tr:nth-child(odd) td {
    background-color: #f9f9f9;
}
.report-table tr:nth-child(even) td {
    background-color: #e9ecef;
}

/* Button styling */
.report-btn {
    padding: 5px 10px;
    margin: 5px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.report-btn-success {
    background-color: #28a745;
    color: #fff;
}

.report-btn-success:hover {
    background-color: #218838;
}

.report-btn-primary {
    background-color: #08519f;
    color: white;
}

.report-btn-group {
    display: flex;
}

/* Modal styling */
.report-modal {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.report-modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 80%;
    max-width: 600px;
    max-height: 80%;
    overflow-y: auto;
}

.report-close {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 30px;
    cursor: pointer;
}

.report-modal-bold {
    font-weight: bold;
}

.report-modal-footer {
    padding: 16px 25px 40px 25px;
    border-radius: 8px;
}

/* Pagination styling */
.report-pagination {
    display: flex;
    list-style: none;
    padding: 0;
    justify-content: center;
    margin-top: 20px;
}

.report-page-item {
    margin: 0 5px;
    padding: 8px 12px;
    cursor: pointer;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    background-color: #fff;
}

.report-page-item:hover {
    background-color: #e9ecef;
}

.report-page-item-active {
    z-index: 1;
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.report-table-wrapper::-webkit-scrollbar {
    display: none;
}

@media (max-width: 768px) {
    .report-filters {
        flex-direction: column;
    }

    .report-filters input {
        margin-bottom: 10px;
    }
}

```

# src\components\logviewer\report.jsx

```jsx
import React, { useEffect, useState, useRef } from "react";
import AsideBar from "../asidebar/aside";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./report.css";
import ReactToPrint from "react-to-print";

function Alerts() {
  const [tableData, setTableData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [transactionHash, setTransactionHash] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 25;
  const componentRef = useRef();

  useEffect(() => {
    // Fetches logs from the backend and updates
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`
        );
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          let parsedData1;
          let parsedData2;
          if (typeof parsedItem.data === "string" && parsedItem.data !== "") {
            parsedData1 = JSON.parse(parsedItem.data);
          }
          if (
            typeof parsedItem.prevData === "string" &&
            parsedItem.prevData !== ""
          ) {
            if (parsedItem.prevData.length !== 0) {
              parsedData2 = JSON.parse(parsedItem.prevData);
            }
          }
          return {
            ...parsedItem,
            data: parsedData1,
            prevData: parsedData2,
            tokenId: item.tokenId,
          };
        });
        setTableData(parsedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Processes the fetched logs to extract alert-related information
    const processTableData = () => {
      let alertCount = 0;
      let attendanceCount = 0;
      let gradingCount = 0;

      const alertsByHour = {};

      tableData.forEach((entry) => {
        if (entry?.type === "alert") {
          alertCount++;
          const alertTimestamp = new Date(entry.timestamp);
          const hourDifference = Math.floor(
            (new Date() - alertTimestamp) / (1000 * 60 * 60)
          );
          alertsByHour[hourDifference] =
            (alertsByHour[hourDifference] || 0) + 1;
          setAlerts((prev) => [...prev, entry]);
        } else if (entry?.action === "attendance") {
          attendanceCount++;
        } else if (entry?.action === "grading") {
          gradingCount++;
        }
      });

      setAlertCount(alertCount);
    };

    if (tableData.length > 0) {
      setAlerts([]);
      processTableData();
    }
  }, [tableData]);

  useEffect(() => {
    if (alerts.length > 0) {
      const uniqueMonthsYears = [
        ...new Set(
          alerts.map((item) => {
            const [year, month] = item.timestamp.split("-").slice(0, 2);
            return `${month}-${year}`;
          })
        ),
      ];

      const seriesData = uniqueMonthsYears.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return alerts.reduce((count, item) => {
          const [itemYear, itemMonth] = item.timestamp.split("-").slice(0, 2);
          if (itemYear === year && itemMonth === month) {
            return count + 1;
          }
          return count;
        }, 0);
      });
    }
  }, [alerts]);

  // Filter alerts based on teacher name and type filters
  useEffect(() => {
    let filtered = alerts;

    if (teacherFilter) {
      filtered = filtered.filter((alert) =>
        alert.teacherName.toLowerCase().includes(teacherFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((alert) =>
        alert.action.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, teacherFilter, typeFilter]);

  useEffect(() => {
    const getTransactionHashes = async () => {
      const docRef = collection(db, "transactionHashes");
      const temp = {};

      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        temp[doc.id] = doc.data().transactionHash;
      });
      setTransactionHash(temp);
    };

    getTransactionHashes();
  }, []);

  const getChangedData = (newData, prevData) => {
    const changes = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        changes[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return changes;
  };

  const getChangedGrade = (newData, prevData) => {
    const Gradechanges = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        Gradechanges[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return Gradechanges;
  };

  const filterChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const filterGradeChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const handleDownloadChangedData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedGrade(item.data, item.prevData);
      const data = JSON.stringify(changedData, null, 2);
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "changed_data.log";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleViewGradeData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedGrade(item.data, item.prevData);
      const filteredData1 = Object.keys(changedData);

      const columnsToDisplay = {
        mid: false,
        assignment: false,
        quiz: false,
        final: false,
      };

      filteredData1.forEach((key) => {
        if (changedData[key]?.old?.mid || changedData[key]?.new?.mid)
          columnsToDisplay.mid = true;
        if (
          changedData[key]?.old?.assignment?.some((a) => a) ||
          changedData[key]?.new?.assignment?.some((a) => a)
        )
          columnsToDisplay.assignment = true;
        if (
          changedData[key]?.old?.quiz?.some((q) => q) ||
          changedData[key]?.new?.quiz?.some((q) => q)
        )
          columnsToDisplay.quiz = true;
        if (changedData[key]?.old?.final || changedData[key]?.new?.final)
          columnsToDisplay.final = true;
      });

      setModalData(
        <div>
          <div ref={componentRef} style={{ marginLeft: "50px", marginRight: "50px" }}>
            <h2 style={{ textAlign: "center" }}>Grade Data Report</h2>
            <h3 style={{ textAlign: "center" }}>Detailed Grade Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <table className="report-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "8px" }}>#</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Student ID</th>
                  {columnsToDisplay.mid && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Midterm (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Midterm (New)</th>
                    </>
                  )}
                  {columnsToDisplay.assignment && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Assignments (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Assignments (New)</th>
                    </>
                  )}
                  {columnsToDisplay.quiz && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Quizzes (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Quizzes (New)</th>
                    </>
                  )}
                  {columnsToDisplay.final && (
                    <>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Final (Old)</th>
                      <th style={{ border: "1px solid black", padding: "8px" }}>Final (New)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData1.map((key, index) => (
                  <tr key={key}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{key}</td>
                    {columnsToDisplay.mid && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.mid ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.mid ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.assignment && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.assignment?.join(", ") ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.assignment?.join(", ") ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.quiz && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.quiz?.join(", ") ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.quiz?.join(", ") ?? ''}</td>
                      </>
                    )}
                    {columnsToDisplay.final && (
                      <>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.old?.final ?? ''}</td>
                        <td style={{ border: "1px solid black", padding: "8px" }}>{changedData[key]?.new?.final ?? ''}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: oneblock@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success" onClick={handlePrint} style={{ marginTop: "16px" }}>Print</button>}
            content={() => componentRef.current}
          />
        </div>
      );
      setModalVisible(true);
    }
  };

  const handleViewAttendanceData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedData(item.data, item.prevData);
      const filteredData = filterChangedEntries(changedData);
      const filteredData1 = Object.keys(filteredData);

      setModalData(
        <div>
          <div ref={componentRef} style={{ marginLeft: "50px", marginRight: "50px" }}>
            <h2 style={{ textAlign: "center" }}>Attendance Data Report</h2>
            <h3 style={{ textAlign: "center" }}>Detailed Attendance Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <table className="report-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid black", padding: "8px" }}>#</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Roll Number</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>Old Present Status</th>
                  <th style={{ border: "1px solid black", padding: "8px" }}>New Present Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData1.map((key, index) => (
                  <tr key={key}>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{index + 1}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{key}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].new.name}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].old.isPresent.toString()}</td>
                    <td style={{ border: "1px solid black", padding: "8px" }}>{filteredData[key].new.isPresent.toString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: oneblock@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success" onClick={handlePrint} style={{ marginTop: "16px" }}>Print</button>}
            content={() => componentRef.current}
          />
        </div>
      );
      setModalVisible(true);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredAlerts.slice(indexOfFirstLog, indexOfLastLog);
  const reversedLogs = [...currentLogs].reverse();
  const totalPages = Math.ceil(filteredAlerts.length / logsPerPage);

  const handleClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > 3 && currentPage < totalPages - 2) {
        pageNumbers.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      } else {
        pageNumbers.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      }
    }

    return (
      <>
        <li className={`report-page-item ${currentPage === 1 ? 'disabled' : ''}`} onClick={() => handleClick(currentPage - 1)}>
          Previous
        </li>
        {pageNumbers.map((number, index) =>
          typeof number === "number" ? (
            <li key={index} className={`report-page-item ${currentPage === number ? 'active' : ''}`} onClick={() => handleClick(number)}>
              {number}
            </li>
          ) : (
            <li key={index} className="report-page-item">...</li>
          )
        )}
        <li className={`report-page-item ${currentPage === totalPages ? 'disabled' : ''}`} onClick={() => handleClick(currentPage + 1)}>
          Next
        </li>
      </>
    );
  };

  return (
    <div className="report-dashboard-main-wrapper">
      <AsideBar />
      <div className="report-content-area">
        <div className="report-after-content-wrap">
          {/* alerts component starts here */}
          <div className="report-alerts-main">
            <div className="report-header">
              <h3 className="my-3">Log Viewer</h3>
              <div className="report-filters">
                <label>
                  <input
                    type="text"
                    value={teacherFilter}
                    onChange={(e) => setTeacherFilter(e.target.value)}
                    placeholder="Filter by Teacher Name"
                  />
                </label>
                <label>
                  <input
                    type="text"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    placeholder="Filter by Type"
                  />
                </label>
              </div>
            </div>
  
            <div className="report-tables-starts">
              <div className="report-table-wrapper">
                <table className="report-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Teacher Name</th>
                      <th>Action</th>
                      <th>Type</th>
                      <th>IP Address</th>
                      <th>New Data</th>
                      <th>New Hash</th>
                      <th>Previous Data</th>
                      <th>Previous Hash</th>
                      <th>View Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts &&
                      filteredAlerts
                        .slice()
                        .reverse() // Display in reverse order
                        .map((item, i) => {
                          const handleDownload = () => {
                            if (item.data) {
                              const data = JSON.stringify(item.data, null, 2);
                              const blob = new Blob([data], {
                                type: "text/plain",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "new_data.log";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }
                          };
  
                          const handleDownload2 = () => {
                            if (item.prevData) {
                              const data = JSON.stringify(item.prevData, null, 2);
                              const blob = new Blob([data], {
                                type: "text/plain",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "prev_data.log";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }
                          };
  
                          const handleDownloadChangedData = () => {
                            if (item.data && item.prevData) {
                              const changedData = getChangedData(
                                item.data,
                                item.prevData
                              );
                              const tryData = filterChangedEntries(changedData);
                              const data = JSON.stringify(tryData, null, 2);
                              const blob = new Blob([data], {
                                type: "text/plain",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "changed_data.log";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }
                          };
  
                          if (item.data && item.prevData) {
                            const changedData = getChangedData(
                              item.data,
                              item.prevData
                            );
                            if (Object.keys(changedData).length === 0) {
                              return null; // Skip rendering this row
                            }
                          }
  
                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.teacherName}</td>
                              <td>{item.action}</td>
                              <td>{item?.type ? item.type : "-"}</td>
                              <td>{item.ipAddress}</td>
                              <td>
                                {item.data ? (
                                  <button
                                    className="report-btn report-btn-success"
                                    onClick={handleDownload}
                                  >
                                    New Data
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {transactionHash &&
                                transactionHash[item.tokenId] === undefined
                                  ? "-"
                                  : transactionHash &&
                                    transactionHash[item.tokenId]}
                              </td>
                              <td>
                                {item.prevData ? (
                                  <button
                                    className="report-btn report-btn-success"
                                    onClick={handleDownload2}
                                  >
                                    Previous Data
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {transactionHash &&
                                transactionHash[item.tokenId - 1] === undefined
                                  ? "-"
                                  : transactionHash &&
                                    transactionHash[item.tokenId - 1]}
                              </td>
                              <td>
                                <div
                                  className="report-btn-group"
                                  role="group"
                                  aria-label="View Data"
                                >
                                  {item.action === "grading" && (
                                    <button
                                      className="report-btn report-btn-primary"
                                      onClick={() => handleViewGradeData(item)}
                                    >
                                      View Grade
                                    </button>
                                  )}
                                  {item.action === "attendance" && (
                                    <button
                                      className="report-btn report-btn-primary"
                                      onClick={() => handleViewAttendanceData(item)}
                                    >
                                      View Attendance
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
  
                {!showAllLogs && filteredAlerts && filteredAlerts.length > 5 && (
                  <button
                    className="report-btn report-btn-success"
                    onClick={() => setShowAllLogs(true)}
                  >
                    See More
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* alerts component ends here */}
        </div>
      </div>
  
      {modalVisible && (
        <div className="report-modal">
          <div className="report-modal-content">
            <span className="report-close" onClick={() => setModalVisible(false)}>
              &times;
            </span>
            <pre>{modalData}</pre>
          </div>
        </div>
      )}
    </div>
  );  
}

export default Alerts;

```

# src\components\Report\report - Copy.jsx

```jsx
import React, { useEffect, useState } from "react";
import AsideBar from "../asidebar/aside";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./report.scss";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Alerts() {
  const [tableData, setTableData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [transactionHash, setTransactionHash] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`
        );
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          let parsedData1;
          let parsedData2;
          if (typeof parsedItem.data === "string" && parsedItem.data !== "") {
            parsedData1 = JSON.parse(parsedItem.data);
          }
          if (
            typeof parsedItem.prevData === "string" &&
            parsedItem.prevData !== ""
          ) {
            if (parsedItem.prevData.length !== 0) {
              parsedData2 = JSON.parse(parsedItem.prevData);
            }
          }
          return {
            ...parsedItem,
            data: parsedData1,
            prevData: parsedData2,
            tokenId: item.tokenId,
          };
        });
        setTableData(parsedData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const processTableData = () => {
      let alertCount = 0;
      let attendanceCount = 0;
      let gradingCount = 0;

      const alertsByHour = {};

      tableData.forEach((entry) => {
        if (entry?.type === "alert") {
          alertCount++;
          const alertTimestamp = new Date(entry.timestamp);
          const hourDifference = Math.floor(
            (new Date() - alertTimestamp) / (1000 * 60 * 60)
          );
          alertsByHour[hourDifference] =
            (alertsByHour[hourDifference] || 0) + 1;
          setAlerts((prev) => [...prev, entry]);
        } else if (entry?.action === "attendance") {
          attendanceCount++;
        } else if (entry?.action === "grading") {
          gradingCount++;
        }
      });

      setAlertCount(alertCount);
    };

    if (tableData.length > 0) {
      setAlerts([]);
      processTableData();
    }
  }, [tableData]);

  useEffect(() => {
    if (alerts.length > 0) {
      const uniqueMonthsYears = [
        ...new Set(
          alerts.map((item) => {
            const [year, month] = item.timestamp.split("-").slice(0, 2);
            return `${month}-${year}`;
          })
        ),
      ];

      const seriesData = uniqueMonthsYears.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return alerts.reduce((count, item) => {
          const [itemYear, itemMonth] = item.timestamp.split("-").slice(0, 2);
          if (itemYear === year && itemMonth === month) {
            return count + 1;
          }
          return count;
        }, 0);
      });
    }
  }, [alerts]);

  useEffect(() => {
    let filtered = alerts;

    if (teacherFilter) {
      filtered = filtered.filter((alert) =>
        alert.teacherName.toLowerCase().includes(teacherFilter.toLowerCase())
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((alert) =>
        alert.action.toLowerCase().includes(typeFilter.toLowerCase())
      );
    }

    setFilteredAlerts(filtered);
  }, [alerts, teacherFilter, typeFilter]);

  useEffect(() => {
    const getTransactionHashes = async () => {
      const docRef = collection(db, "transactionHashes");
      const temp = {};

      const docSnap = await getDocs(docRef);
      docSnap.forEach((doc) => {
        temp[doc.id] = doc.data().transactionHash;
      });
      setTransactionHash(temp);
    };

    getTransactionHashes();
  }, []);

  const getChangedData = (newData, prevData) => {
    const changes = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        changes[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return changes;
  };

  const getChangedGrade = (newData, prevData) => {
    const Gradechanges = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        Gradechanges[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return Gradechanges;
  };

  const filterChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const filterGradeChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  const handleDownloadChangedData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedGrade(item.data, item.prevData);
      const data = JSON.stringify(changedData, null, 2);
      const blob = new Blob([data], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "changed_data.log";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleViewData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedData(item.data, item.prevData);
      const filteredData = filterChangedEntries(changedData);
      setModalData(JSON.stringify(filteredData, null, 2));
      setModalData(<table className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>New Name</th>
          <th>New isPresent</th>
          <th>Old Name</th>
          <th>Old isPresent</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((key, index) => (
          <tr key={key}>
            <td>{index + 1}</td>
            <td>{key}</td>
            <td>{data[key].new.name}</td>
            <td>{data[key].new.isPresent.toString()}</td>
            <td>{data[key].old.name}</td>
            <td>{data[key].old.isPresent.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>);
      setModalVisible(true);
    }
  };

  const handleViewGradeData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedData(item.data, item.prevData);
      setModalData(JSON.stringify(changedData, null, 2));
      setModalVisible(true);
    }
  };

  const downloadPDF = () => {
    const input = document.getElementById('table-to-pdf');
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        pdf.save('table.pdf');
      });
  };

  const handleViewAttendanceData = (item) => {
    if (item.data && item.prevData) {
      const changedData = getChangedData(item.data, item.prevData);
      const filteredData = filterChangedEntries(changedData);
      const filteredData1 = Object.keys(filteredData);
      //setModalData(JSON.stringify(filteredData, null, 2));
      setModalData(
        <div>
      <table id="table-to-pdf" className="table">
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th>
          <th>New Name</th>
          <th>New isPresent</th>
          <th>Old Name</th>
          <th>Old isPresent</th>
        </tr>
      </thead>
      <tbody>
        {filteredData1.map((key, index) => (
          <tr key={key}>
            <td>{index + 1}</td>
            <td>{key}</td>
            <td>{filteredData[key].new.name}</td>
            <td>{filteredData[key].new.isPresent.toString()}</td>
            <td>{filteredData[key].old.name}</td>
            <td>{filteredData[key].old.isPresent.toString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    
    <button className="btn btn-primary" onClick={downloadPDF}>
        Download PDF
      </button>
    </div>
    );
      setModalVisible(true);
    }
  };

  return (
    <div className="dashboard-main-wrapper">
      <AsideBar />
      <div className="content-area">
        <div className="after-content-wrap">
          <div className="alerts-main">
            <div className="filters">
              <label>
                Teacher Name
                <input
                  type="text"
                  value={teacherFilter}
                  onChange={(e) => setTeacherFilter(e.target.value)}
                  placeholder="Filter by Teacher Name"
                />
              </label>
              <label>
                Action Type
                <input
                  type="text"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  placeholder="Filter by Type"
                />
              </label>
            </div>

            <div className="tables-starts">
              <h3 className="my-3">Alerts</h3>
              <div className="table-wrapper">
              <table className="table">
  <thead>
    <tr>
      <th>#</th>
      <th>Teacher Name</th>
      <th>Action</th>
      <th>Type</th>
      <th>IP Address</th>
      <th>Last Data</th>
      <th>Previous Transaction Hash</th>
      <th>Updated Data</th>
      <th>New Transaction Hash</th>
      <th>View Data</th>
    </tr>
  </thead>
  <tbody>
    {filteredAlerts &&
      filteredAlerts
        .slice()
        .reverse()
        .map((item, i) => {
          const handleDownload = () => {
            if (item.data) {
              const data = JSON.stringify(item.data, null, 2);
              const blob = new Blob([data], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "new_data.log";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          };

          const handleDownload2 = () => {
            if (item.prevData) {
              const data = JSON.stringify(item.prevData, null, 2);
              const blob = new Blob([data], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "prev_data.log";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
          };

          // Filter out entries where new and old data are the same
          if (item.data && item.prevData) {
            const changedData = getChangedData(item.data, item.prevData);
            if (Object.keys(changedData).length === 0) {
              return null; // Skip rendering this row
            }
          }

          return (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{item.teacherName}</td>
              <td>{item.action}</td>
              <td>{item?.type ? item.type : "-"}</td>
              <td>{item.ipAddress}</td>
              <td>
                {item.data ? (
                  <button
                    className="btn btn-success"
                    onClick={handleDownload}
                  >
                    New Data
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {transactionHash &&
                transactionHash[item.tokenId - 1] === undefined
                  ? "-"
                  : transactionHash && transactionHash[item.tokenId - 1]}
              </td>
              <td>
                {item.prevData ? (
                  <button
                    className="btn btn-success"
                    onClick={handleDownload2}
                  >
                    Previous Data
                  </button>
                ) : (
                  "-"
                )}
              </td>
              <td>
                {transactionHash &&
                transactionHash[item.tokenId] === undefined
                  ? "-"
                  : transactionHash && transactionHash[item.tokenId]}
              </td>
              <td>
                <div className="btn-group" role="group" aria-label="View Data">
                  {item.action === "grading" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewGradeData(item)}
                    >
                      View Grade Data
                    </button>
                  )}
                  {item.action === "attendence" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleViewAttendanceData(item)}
                    >
                      View Attendance Data
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
  </tbody>
</table>


                {!showAllLogs && filteredAlerts && filteredAlerts.length > 5 && (
                  <button
                    className="btn btn-success"
                    onClick={() => setShowAllLogs(true)}
                  >
                    See More
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setModalVisible(false)}>
              &times;
            </span>
            <pre>{modalData}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alerts;

```

# src\components\Report\report copy.jsx

```jsx
import React, { useEffect, useState } from "react";
import AsideBar from "../asidebar/aside";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./report.scss";

function Alerts() {
  const [tableData, setTableData] = useState();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [teacherFilter, setTeacherFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [changedData, setChangedData] = useState(null);

  useEffect(() => {
    if (tableData) {
      setAlerts([]);
      let alertCount = 0;``
      let attendanceCount = 0;
      let gradingCount = 0;

      const currentTimestamp = new Date();

      // Initialize an object to store counts for each hour
      const alertsByHour = {};

      // Loop through each data entry
      for (let i = 0; i < tableData.length; i++) {
        const entry = tableData[i];

        // Increment counts based on action type
        if (entry?.type === "alert") {
          alertCount++;

          // Extract timestamp and calculate time difference
          const alertTimestamp = new Date(entry.timestamp);
          const timeDifference =
            (currentTimestamp - alertTimestamp) / (1000 * 60 * 60); // Difference in hours

          // Round down to the nearest hour
          const hourDifference = Math.floor(timeDifference);

          // Increment count for the respective hour
          alertsByHour[hourDifference] =
            (alertsByHour[hourDifference] || 0) + 1;

          // Add alert to alerts array
          setAlerts((prev) => [...prev, entry]);
        } else if (entry?.action === "attendance") {
          attendanceCount++;
        } else if (entry?.action === "grading") {
          gradingCount++;
        }
      }

      // Set counts for attendance and grading
      setAlertCount(alertCount);

      // Set counts for pie chart data
      const actionCounts = {
        Attendance: attendanceCount,
        Grading: gradingCount,
        Alert: alertCount,
      };

      const actionLabels = Object.keys(actionCounts);
      const actionData = Object.values(actionCounts);

      
    }
  }, [tableData]);

  useEffect(() => {
    if (alerts && alerts.length > 0) {
      const uniqueMonthsYears = [
        ...new Set(
          alerts.map((item) => {
            const [year, month] = item.timestamp.split("-").slice(0, 2); // Adjust if timestamp format is different
            return `${month}-${year}`;
          })
        ),
      ];

      // Counting the number of logs for each unique month-year combination
      const seriesData = uniqueMonthsYears.map((monthYear) => {
        const [month, year] = monthYear.split("-");
        return alerts.reduce((count, item) => {
          const [itemYear, itemMonth] = item.timestamp.split("-").slice(0, 2); // Adjust if timestamp format is different
          if (itemYear === year && itemMonth === month) {
            return count + 1;
          }
          return count;
        }, 0);
      });

    }
  }, [alerts]);

  useEffect(() => {
    if (alerts) {
      let filtered = alerts;

      if (teacherFilter) {
        filtered = filtered.filter((alert) =>
          alert.teacherName.toLowerCase().includes(teacherFilter.toLowerCase())
        );
      }

      if (typeFilter) {
        filtered = filtered.filter((alert) =>
          alert.action.toLowerCase().includes(typeFilter.toLowerCase())
        );
      }

      setFilteredAlerts(filtered);
    }
  }, [alerts, teacherFilter, typeFilter]);

  const getLogs = async () => {
    const url2 = `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`;
    await axios
      .get(url2)
      .then((response) => {
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          let parsedData1;
          let parsedData2;
          if (typeof parsedItem.data === "string" && parsedItem.data !== "") {
            parsedData1 = JSON.parse(parsedItem.data);
          }
          if (
            typeof parsedItem.prevData === "string" &&
            parsedItem.prevData !== ""
          ) {
            if (parsedItem.prevData.length !== 0) {
              parsedData2 = JSON.parse(parsedItem.prevData);
            }
          }
          return {
            ...parsedItem,
            data: parsedData1,
            prevData: parsedData2,
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

  const [transactionHash, setTransactionHash] = useState();
  const getTransactionHashes = async () => {
    const docRef = collection(db, "transactionHashes");
    const temp = {};

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
    console.log(transactionHash);
  }, [transactionHash]);

  const getChangedData = (newData, prevData) => {
    const changes = {};
    for (const key in newData) {
      if (newData[key] !== prevData[key]) {
        changes[key] = { new: newData[key], old: prevData[key] };
      }
    }
    return changes;
  };

  const filterChangedEntries = (data) => {
    const filteredData = {};
    for (const key in data) {
      const { new: newData, old: oldData } = data[key];
      let isDifferent = false;
      for (const field in newData) {
        if (newData[field] !== oldData[field]) {
          isDifferent = true;
          break;
        }
      }
      if (isDifferent) {
        filteredData[key] = data[key];
      }
    }
    return filteredData;
  };

  return (
    <div className="dashboard-main-wrapper">
      <AsideBar />
      <div className="content-area">
        <div className="after-content-wrap">
          {/* alerts component starts here */}
          <div className="alerts-main">

            <div className="filters">
              <label>
                Teacher Name
                <input
                  type="text"
                  value={teacherFilter}
                  onChange={(e) => setTeacherFilter(e.target.value)}
                  placeholder="Filter by Teacher Name"
                />
              </label>
              <label>
                Action Type
                <input
                  type="text"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  placeholder="Filter by Type"
                />
              </label>
            </div>

            <div className="tables-starts">
              <h3 className="my-3">Alerts</h3>
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Teacher Name</th>
                      <th>Action</th>
                      <th>Type</th>
                      <th>IP Address</th>
                      <th>Last Data</th>
                      <th>Previous Transaction Hash</th>
                      <th>Updated Data</th>
                      <th>New Transaction Hash</th>
                      <th>Only Changed Data</th> {/* New column */}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAlerts &&
                      filteredAlerts
                        .slice()
                        .reverse() // Display in reverse order
                        .map((item, i) => {
                          const handleDownload = () => {
                            if (item.data) {
                              const data = JSON.stringify(item.data, null, 2);
                              const blob = new Blob([data], {
                                type: "text/plain",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "new_data.log";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }
                          };

                          const handleDownload2 = () => {
                            if (item.prevData) {
                              const data = JSON.stringify(
                                item.prevData,
                                null,
                                2
                              );
                              const blob = new Blob([data], {
                                type: "text/plain",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "prev_data.log";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }
                          };


                          const handleDownloadChangedData = () => {
                            if (item.data && item.prevData) {
                              const changedData = getChangedData(
                                item.data,
                                item.prevData
                              );
                              const tryData = filterChangedEntries(changedData)
                              const data = JSON.stringify(tryData, null, 2);
                              const blob = new Blob([data], {
                                type: "text/plain",
                              });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement("a");
                              a.href = url;
                              a.download = "changed_data.log";
                              document.body.appendChild(a);
                              a.click();
                              document.body.removeChild(a);
                              URL.revokeObjectURL(url);
                            }
                          };


                          // Filter out entries where new and old data are the same
                          if (item.data && item.prevData) {
                            const changedData = getChangedData(
                              item.data,
                              item.prevData
                            );
                            if (Object.keys(changedData).length === 0) {
                              return null; // Skip rendering this row
                            }
                          }

                          return (
                            <tr key={i}>
                              <td>{i + 1}</td>
                              <td>{item.teacherName}</td>
                              <td>{item.action}</td>
                              <td>{item?.type ? item.type : "-"}</td>
                              <td>{item.ipAddress}</td>
                              <td>
                                {item.data ? (
                                  <button
                                    className="btn btn-success"
                                    onClick={handleDownload}
                                  >
                                    New Data
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {transactionHash &&
                                transactionHash[item.tokenId - 1] ===
                                  undefined
                                  ? "-"
                                  : transactionHash &&
                                    transactionHash[item.tokenId - 1]}
                              </td>
                              <td>
                                {item.prevData ? (
                                  <button
                                    className="btn btn-success"
                                    onClick={handleDownload2}
                                  >
                                    Previous Data
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                              <td>
                                {transactionHash &&
                                transactionHash[item.tokenId] === undefined
                                  ? "-"
                                  : transactionHash &&
                                    transactionHash[item.tokenId]}
                              </td>
                              <td>
                               
                              <td>
                                
                              </td> {item.data && item.prevData ? (
                                  <button
                                    className="btn btn-warning"
                                    onClick={handleDownloadChangedData}
                                  >
                                    Changed Data
                                  </button>
                                ) : (
                                  "-"
                                )}
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>

                {!showAllLogs && filteredAlerts && filteredAlerts.length > 5 && (
                  <button
                    className="btn btn-success"
                    onClick={() => setShowAllLogs(true)}
                  >
                    See More
                  </button>
                )}
              </div>
            </div>
          </div>
          {/* alerts component ends here */}
        </div>
      </div>
    </div>
  );
}

export default Alerts;
```

# src\components\teammembers\index.scss

```scss
// .main-wrapper {
//   display: flex;
//   gap: 30px;
//   padding-right: 50px;
//   .card-wrapper {
//     .image-wrapper {
//       img {
//         width: 100%;
//         height: 100%;
//       }
//     }
//   }
// }

```

# src\components\teammembers\team.jsx

```jsx
// import React from "react";
// import "./index.scss";
// function TeamMembers() {
//   return (
//     <div>
//       <h3 className="my-3">Team Members</h3>

//       <div className="main-wrapper">
//         <div className="card-wrapper">
//           <div className="image-wrapper">
//             <img
//               className="w-100"
//               src="../../../assets/images/image1.jpg"
//               alt=""
//             />
//           </div>
//           <div className="content-wrapper">
//             <div className="Designation: Student">
//               <h4>Designation: Student</h4>
//               <h5>Hamza</h5>
//             </div>
//           </div>
//         </div>
//         <div className="card-wrapper">
//           <div className="image-wrapper">
//             <img
//               className="w-100"
//               src="../../../assets/images/image1.jpg"
//               alt=""
//             />
//           </div>
//           <div className="content-wrapper">
//             <div className="Designation: Student">
//               <h4>Designation: Student</h4>
//               <h5>Wajahat</h5>
//             </div>
//           </div>
//         </div>
//         <div className="card-wrapper">
//           <div className="image-wrapper">
//             <img
//               className="w-100"
//               src="../../../assets/images/image1.jpg"
//               alt=""
//             />
//           </div>
//           <div className="content-wrapper">
//             <div className="Designation: Student">
//               <h4>Designation: Student</h4>
//               <h5>Ali</h5>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TeamMembers;

```

# src\firebase\firebaseConfig.js

```js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { doc, getFirestore } from "firebase/firestore";
import { collection, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMyxy0sY96aKQSwpa-3tGH_NtxAF4oK5Q",
  authDomain: "logviewer-966bc.firebaseapp.com",
  projectId: "logviewer-966bc",
  storageBucket: "logviewer-966bc.appspot.com",
  messagingSenderId: "179279904966",
  appId: "1:179279904966:web:80ee1fe727d208264157c7",
  measurementId: "G-122MQKK30H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const getAdmin = async () => {
  let students;
  const docRef = doc(db, "admin", "adminCredentials");

  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    students = docSnap.data();
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  return students;
  // console.log(students);
};

```

# src\index.css

```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
}

```

# src\main.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Import Bootstrap CSS and JS
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

# src\pages\dashboardpage.jsx

```jsx
import React from "react";
import Dashboard from "../components/dashboard/dashboard";
import AsideBar from "../components/asidebar/aside";

function DashboardPage() {
  return (
    <div className="dashboard-main-wrapper">
      <AsideBar />
      <div className="content-area">
        <div className="after-content-wrap">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

```

# src\pages\teampage.jsx

```jsx
// import React from "react";
// import AsideBar from "../components/asidebar/aside";
// // import TeamMembers from "../components/teammembers/team";

// function TeamPage() {
//   return (
//     <div className="dashboard-main-wrapper">
//       <AsideBar />
//       <div className="content-area">
//         <div className="after-content-wrap">
//           <TeamMembers />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TeamPage;

```

# vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})

```

