
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
