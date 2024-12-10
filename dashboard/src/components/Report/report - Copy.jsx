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
              return null; 
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
