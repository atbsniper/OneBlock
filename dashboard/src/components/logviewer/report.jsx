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
          `${import.meta.env.VITE_BASE_URL_LIVE}/LogGard/getLogs`
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
      const columnsToDisplay = {
        mid: Object.values(changedData).some(
          (item) => item.old?.mid !== undefined || item.new?.mid !== undefined
        ),
        assignment: Object.values(changedData).some(
          (item) => item.old?.assignment?.length || item.new?.assignment?.length
        ),
        quiz: Object.values(changedData).some(
          (item) => item.old?.quiz?.length || item.new?.quiz?.length
        ),
        final: Object.values(changedData).some(
          (item) => item.old?.final !== undefined || item.new?.final !== undefined
        ),
      };

      const columnCount = 1 + 
        (columnsToDisplay.mid ? 2 : 0) + 
        (columnsToDisplay.assignment ? 2 : 0) + 
        (columnsToDisplay.quiz ? 2 : 0) + 
        (columnsToDisplay.final ? 2 : 0);

      setModalData(
        <div>
          <div ref={componentRef} className="report-print-container">
            <h2>Grade Data Report</h2>
            <h3>Detailed Grade Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <div className="report-table-wrapper">
              <table className="report-table" data-print-table data-columns={columnCount}>
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    {columnsToDisplay.mid && (
                      <>
                        <th>Old Mid</th>
                        <th>New Mid</th>
                      </>
                    )}
                    {columnsToDisplay.assignment && (
                      <>
                        <th>Old Assignment</th>
                        <th>New Assignment</th>
                      </>
                    )}
                    {columnsToDisplay.quiz && (
                      <>
                        <th>Old Quiz</th>
                        <th>New Quiz</th>
                      </>
                    )}
                    {columnsToDisplay.final && (
                      <>
                        <th>Old Final</th>
                        <th>New Final</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(changedData).map((key) => (
                    <tr key={key}>
                      <td>{key}</td>
                      {columnsToDisplay.mid && (
                        <>
                          <td>{changedData[key]?.old?.mid ?? ''}</td>
                          <td>{changedData[key]?.new?.mid ?? ''}</td>
                        </>
                      )}
                      {columnsToDisplay.assignment && (
                        <>
                          <td>{changedData[key]?.old?.assignment?.join(", ") ?? ''}</td>
                          <td>{changedData[key]?.new?.assignment?.join(", ") ?? ''}</td>
                        </>
                      )}
                      {columnsToDisplay.quiz && (
                        <>
                          <td>{changedData[key]?.old?.quiz?.join(", ") ?? ''}</td>
                          <td>{changedData[key]?.new?.quiz?.join(", ") ?? ''}</td>
                        </>
                      )}
                      {columnsToDisplay.final && (
                        <>
                          <td>{changedData[key]?.old?.final ?? ''}</td>
                          <td>{changedData[key]?.new?.final ?? ''}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: oneblock623@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success">Print</button>}
            content={() => componentRef.current}
            pageStyle={`
              @page {
                size: landscape;
                margin: 5mm;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                table { width: 100% !important; }
                th, td { 
                  padding: 2px !important;
                  font-size: 8px !important;
                }
              }
            `}
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
          <div ref={componentRef} className="report-print-container">
            <h2>Attendance Data Report</h2>
            <h3>Detailed Attendance Changes</h3>
            <p className="report-modal-bold">Teacher Name: {item.teacherName}</p>
            <p className="report-modal-bold">Action: {item.action}</p>
            <p className="report-modal-bold">Report Date: {new Date().toLocaleDateString()}</p>
            <div className="report-table-wrapper">
              <table className="report-table" data-print-table data-columns="5">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Old Present Status</th>
                    <th>New Present Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData1.map((key, index) => (
                    <tr key={key}>
                      <td>{index + 1}</td>
                      <td>{key}</td>
                      <td>{filteredData[key].new.name}</td>
                      <td>{filteredData[key].old.isPresent.toString()}</td>
                      <td>{filteredData[key].new.isPresent.toString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="report-modal-footer">
              <p className="report-modal-bold">1: The report is based on the instructor action.</p>
              <p className="report-modal-bold">2: For Feedback: PH No. 0523-2342343</p>
              <p className="report-modal-bold">3: Email: oneblock623@gmail.com</p>
            </div>
          </div>
          <ReactToPrint
            trigger={() => <button className="report-btn report-btn-success">Print</button>}
            content={() => componentRef.current}
            pageStyle={`
              @page {
                size: landscape;
                margin: 5mm;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
                }
                table { width: 100% !important; }
                th, td { 
                  padding: 2px !important;
                  font-size: 8px !important;
                }
              }
            `}
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
                                {(() => {
                                  try {
                                    // First check if we have any transaction hash data
                                    if (!transactionHash || Object.keys(transactionHash).length === 0) {
                                      return "-";
                                    }
                                    
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
                                {(() => {
                                  try {
                                    // First check if we have any transaction hash data
                                    if (!transactionHash || Object.keys(transactionHash).length === 0) {
                                      return "-";
                                    }
                                    
                                    const tokenIdNum = Number(item.tokenId) - 1; // Previous token ID
                                    const tokenIdStr = String(item.tokenId - 1);
                                    
                                    // Method 1: Exact match as number
                                    if (tokenIdNum in transactionHash) {
                                      return transactionHash[tokenIdNum];
                                    }
                                    
                                    // Method 2: Exact match as string
                                    if (tokenIdStr in transactionHash) {
                                      return transactionHash[tokenIdStr];
                                    }
                                    
                                    // Method 3: Try to look up by position (for sequential tokenIds)
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
                                    console.error("Error displaying hash for tokenId:", item.tokenId - 1, error);
                                    return "-";
                                  }
                                })()}
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
                                      title="View Grade Data"
                                    >
                                      View Grade
                                    </button>
                                  )}
                                  {item.action === "attendance" && (
                                    <button
                                      className="report-btn report-btn-primary"
                                      onClick={() => handleViewAttendanceData(item)}
                                      title="View Attendance Data"
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
                  <div className="text-center mt-3">
                    <button
                      className="report-btn report-btn-success"
                      onClick={() => setShowAllLogs(true)}
                    >
                      See More
                    </button>
                  </div>
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
            <div className="report-modal-body">
              {modalData}
            </div>
          </div>
        </div>
      )}
    </div>
  );  
}

export default Alerts;
