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
  const [ipAddresses, setIpAddresses] = useState({});

  useEffect(() => {
    // Fetch IP addresses
    const fetchIpAddresses = async () => {
      try {
        const response = "192.168.1.1"//await axios.get("https://api64.ipify.org?format=json"); // Replace with your API endpoint
        setIpAddresses(response.data);
      } catch (error) {
        console.error("Error fetching IP addresses:", error);
      }
    };

    fetchIpAddresses();
  }, []);

  return (
    <div>
      {/* Your existing JSX code */}
      <table>
        <thead>
          <tr>
            <th>Alert</th>
            <th>IP Address</th>
            {/* Other headers */}
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr key={index}>
              <td>{alert.message}</td>
              <td>{ipAddresses[alert.id]}</td>
              {/* Other data */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Alerts;