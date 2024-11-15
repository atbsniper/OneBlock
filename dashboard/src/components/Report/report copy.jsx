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