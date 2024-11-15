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
