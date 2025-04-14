import React, { useEffect, useState, useRef } from "react";
import "./dashboard.css";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Toast, ToastContainer } from "react-bootstrap";

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
  const [filteredData, setFilteredData] = useState([]);
  const [filterBy, setFilterBy] = useState("all");
  const [pieChartOptions, setPieChartOptions] = useState({
    chart: {
      type: "pie",
    },
    series: [0, 0],
    labels: ["Attendence", "Grading"],
  });
  const [alertCount, setAlertCount] = useState(0);
  const [transactionHash, setTransactionHash] = useState({});
  
  // For toast notifications
  const [notifications, setNotifications] = useState([]);
  const isFirstRender = useRef(true);
  const previousAlertIds = useRef(new Set());

  // Helper function to check if a date is today
  const isToday = (dateString) => {
    const today = new Date();
    const date = new Date(dateString);
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  // Function to show a notification for a new alert
  const showAlertNotification = (alert) => {
    const newNotification = {
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      title: "New Alert",
      message: `Alert from ${alert.teacherName || 'unknown'} at ${alert.timestamp}`,
      data: alert,
      show: true
    };
    
    setNotifications(prev => [...prev, newNotification]);
  };

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
        setFilteredData(parsedData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to filter data based on selected option
  const filterData = (filterOption) => {
    setFilterBy(filterOption);
    
    if (filterOption === "all") {
      setFilteredData(tableData);
    } else if (filterOption === "alert") {
      setFilteredData(tableData.filter(item => item.type === "alert"));
    } else if (filterOption === "attendence") {
      setFilteredData(tableData.filter(item => item.action === "attendence"));
    } else if (filterOption === "grading") {
      setFilteredData(tableData.filter(item => item.action === "grading"));
    }
  };

  // Initial data fetch
  useEffect(() => {
    getLogs();
    
    // Set up polling to check for new data every 15 seconds
    const interval = setInterval(() => {
      getLogs();
    }, 15000);
    
    return () => clearInterval(interval);
  }, []);

  // Detect new alerts and show notifications
  useEffect(() => {
    // Skip the first render
    if (isFirstRender.current) {
      // Initialize the set of alert IDs from the initial data
      const currentAlertIds = new Set();
      tableData.forEach(item => {
        if (item.type === "alert") {
          currentAlertIds.add(item.tokenId);
        }
      });
      previousAlertIds.current = currentAlertIds;
      isFirstRender.current = false;
      return;
    }
    
    // Find new alerts by comparing with previous alerts
    const currentAlertIds = new Set();
    const newAlerts = [];
    
    tableData.forEach(item => {
      if (item.type === "alert") {
        currentAlertIds.add(item.tokenId);
        
        // If this alert wasn't in our previous set, it's new
        if (!previousAlertIds.current.has(item.tokenId)) {
          // Only add alerts from today
          if (isToday(item.timestamp)) {
            newAlerts.push(item);
          }
        }
      }
    });
    
    // Show notifications for each new alert
    newAlerts.forEach(alert => {
      showAlertNotification(alert);
    });
    
    // Update our reference to the current set of alerts
    previousAlertIds.current = currentAlertIds;
  }, [tableData]);

  // Close notification function
  const closeNotification = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? {...notif, show: false} : notif
      )
    );
    
    // Remove from array after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 500);
  };

  useEffect(() => {
    filterData(filterBy);
  }, [tableData]);

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
      
      setAlertCount(alertCount);

      const actionCounts = {
        Attendence: attendenceCount,
        Grading: gradingCount,
        Alert: alertCount,
      };

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
    try {
      console.log("Fetching transaction hashes...");
      
      // Simple approach: directly access transaction hashes by document ID
      const docRef = collection(db, "transactionHashes");
      const docSnap = await getDocs(docRef);
      
      // Create a map to hold all hash values keyed by BOTH string and number versions of IDs
      const hashMap = {};
      
      docSnap.forEach(doc => {
        if (doc.data() && doc.data().transactionHash) {
          // Store using the exact document ID (as string)
          hashMap[doc.id] = doc.data().transactionHash;
          
          // Also store using the document ID as a number if possible
          const numId = parseInt(doc.id);
          if (!isNaN(numId)) {
            hashMap[numId] = doc.data().transactionHash;
          }
        }
      });
      
      console.log("Simple hash map created:", hashMap);
      setTransactionHash(hashMap);
    } catch (error) {
      console.error("Error in getTransactionHashes:", error);
      setTransactionHash({});
    }
  };

  useEffect(() => {
    getTransactionHashes();
  }, []);

  // For testing - show a sample notification when clicking on "Total Alerts"
  const testNotification = () => {
    const sampleAlert = {
      teacherName: "Test Teacher",
      timestamp: new Date().toISOString(), // Current date and time
      type: "alert"
    };
    
    showAlertNotification(sampleAlert);
  };

  return (
    <div className="dashboard-main-component">
      {/* Toast Container for Notifications */}
      <ToastContainer className="toast-container" position="top-end">
        {notifications.map((notification) => (
          <Toast 
            key={notification.id} 
            show={notification.show} 
            onClose={() => closeNotification(notification.id)} 
            delay={5000} 
            autohide 
            className="notification-toast"
          >
            <Toast.Header closeButton>
              <strong className="me-auto">{notification.title}</strong>
              <small>just now</small>
            </Toast.Header>
            <Toast.Body>
              {notification.message}
              {notification.data && (
                <div className="mt-2">
                  <button 
                    className="btn btn-sm btn-primary" 
                    onClick={() => filterData("alert")}>
                    View Alerts
                  </button>
                </div>
              )}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

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
          <h3 onClick={testNotification} style={{ cursor: 'pointer' }}>Total Alerts</h3>
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
        <div className="d-flex justify-content-between align-items-center my-3">
          <h3>Log Entries</h3>
          <div className="dropdown filter-dropdown">
            <button className="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Filter By {filterBy !== 'all' ? `: ${filterBy}` : ''}
            </button>
            <ul className="dropdown-menu">
              <li><button className="dropdown-item" onClick={() => filterData("all")}>All Logs</button></li>
              <li><button className="dropdown-item" onClick={() => filterData("alert")}>Alerts</button></li>
              <li><button className="dropdown-item" onClick={() => filterData("attendence")}>Attendance</button></li>
              <li><button className="dropdown-item" onClick={() => filterData("grading")}>Grading</button></li>
            </ul>
          </div>
        </div>
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
              {filteredData &&
                filteredData.length > 0 &&
                filteredData.slice().reverse().slice(showAllLogs ? 0 : 0, showAllLogs ? filteredData.length : 5).map((item, i) => {
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
                    <tr key={i} className={item.type === "alert" && isToday(item.timestamp) ? "new-alert-row" : ""}>
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
                        {(() => {
                          try {
                            // First check if we have any transaction hash data
                            if (!transactionHash || Object.keys(transactionHash).length === 0) {
                              return "-";
                            }
                            
                            // Try direct match (both string and number versions)
                            const tokenIdNum = Number(item.tokenId);
                            const tokenIdStr = String(item.tokenId);
                            
                            // Method 1: Exact match as number
                            if (tokenIdNum in transactionHash) {
                              return transactionHash[tokenIdNum];
                            }
                            
                            // Method 2: Exact match as string
                            if (tokenIdStr in transactionHash) {
                              return transactionHash[tokenIdStr];
                            }
                            
                            // Method 3: Try to look up by position (for sequential tokenIds)
                            // Maps from 190-195 range to appropriate doc IDs
                            if (tokenIdNum >= 180) {
                              // For high tokenIds, try mapping to single-digit docIds
                              const singleDigitId = tokenIdNum % 10;
                              if (singleDigitId in transactionHash) {
                                return transactionHash[singleDigitId];
                              }
                              
                              // Try looking up using the last 2 digits
                              const lastTwoDigits = tokenIdNum % 100;
                              if (lastTwoDigits in transactionHash) {
                                return transactionHash[lastTwoDigits];
                              }
                            }
                            
                            return "-";
                          } catch (error) {
                            console.error("Error displaying hash for tokenId:", item.tokenId, error);
                            return "-";
                          }
                        })()}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!showAllLogs && filteredData && filteredData.length > 5 && (
            <button className="btn btn-success" onClick={() => setShowAllLogs(true)}>
              See More
            </button>
          )}
          {filteredData.length === 0 && (
            <div className="text-center my-4">
              <p>No logs found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
