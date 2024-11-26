import React, { useEffect, useState } from "react";
import AsideBar from "../asidebar/aside";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./alerts.css";

function Alerts() {
  const [tableData, setTableData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [alertCount, setAlertCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const alertsPerPage = 10;
  const [transactionHash, setTransactionHash] = useState({});

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/LogGard/getLogs`
        );
        const parsedData = response.data.logs.map((item) => {
          const parsedItem = JSON.parse(item.uri);
          return {
            ...parsedItem,
            data: parsedItem.data ? JSON.parse(parsedItem.data) : null,
            prevData: parsedItem.prevData ? JSON.parse(parsedItem.prevData) : null,
            tokenId: item.tokenId,
          };
        });
        setTableData(parsedData);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    const fetchTransactionHashes = async () => {
      try {
        const docSnap = await getDocs(collection(db, "transactionHashes"));
        const temp = {};
        docSnap.forEach((doc) => {
          temp[doc.id] = doc.data().transactionHash;
        });
        setTransactionHash(temp);
      } catch (error) {
        console.error("Error fetching transaction hashes:", error);
      }
    };

    fetchLogs();
    fetchTransactionHashes();
  }, []);

  useEffect(() => {
    const processAlerts = () => {
      const sortedData = [...tableData].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      const filteredAlerts = sortedData.filter((entry) => entry?.type === "alert");
      setAlerts(filteredAlerts);
      setAlertCount(filteredAlerts.length);
    };

    processAlerts();
  }, [tableData]);

  const handleDownload = (data, filename = "log.json") => {
    if (data) {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const indexOfLastAlert = currentPage * alertsPerPage;
  const currentAlerts = alerts.slice(
    indexOfLastAlert - alertsPerPage,
    indexOfLastAlert
  );

  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  const renderPagination = () => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
      <ul className="pagination">
        <li
          className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          <button className="page-link">Previous</button>
        </li>
        {pages.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "active" : ""}`}
            onClick={() => setCurrentPage(number)}
          >
            <button className="page-link">{number}</button>
          </li>
        ))}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          <button className="page-link">Next</button>
        </li>
      </ul>
    );
  };

  return (
    <div className="alerts-component dashboard-main-wrapper">
      <AsideBar />
      <div className="tables-starts">
        <h3 className="my-3">Alert Descriptions</h3>
        <div className="table-wrapper">
          {currentAlerts.map((item, index) => (
            <div key={index} className="alert-item">
              <p>
                {index + 1}. <strong>{item.teacherName}</strong> with IP{" "}
                {item.ipAddress} changed data from{" "}
                {item.prevData ? (
                  <button
                    className="btn btn-success m-3"
                    onClick={() => handleDownload(item.prevData, "prevData.json")}
                  >
                    previous
                  </button>
                ) : (
                  "N/A"
                )}{" "}
                (transaction hash:{" "}
                {transactionHash[item.tokenId - 1] || "N/A"}) to new data{" "}
                {item.data ? (
                  <button
                    className="btn btn-success m-3"
                    onClick={() => handleDownload(item.data, "newData.json")}
                  >
                    new
                  </button>
                ) : (
                  "N/A"
                )}{" "}
                (transaction hash: {transactionHash[item.tokenId] || "N/A"}).
              </p>
            </div>
          ))}
        </div>
        {alerts.length > alertsPerPage && (
          <nav className="pagination-nav">{renderPagination()}</nav>
        )}
      </div>
    </div>
  );
}

export default Alerts;
