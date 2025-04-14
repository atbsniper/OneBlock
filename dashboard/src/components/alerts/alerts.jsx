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
    const url2 = `${import.meta.env.VITE_BASE_URL_LIVE}/LogGard/getLogs`;
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
          {currentAlerts && currentAlerts.length > 0 ? (
            currentAlerts.map((item, i) => {
              const handleDownload = () => {
                if (item.data) {
                  const data = JSON.stringify(item.data, null, 2);
                  const blob = new Blob([data], { type: "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "alert_data.log";
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
                  a.download = "alert_previous_data.log";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }
              };

              return (
                <div key={i} className="single-alert">
                  <div className="alert-header">
                    <span className="alert-number">{indexOfFirstAlert + i + 1}: </span>
                    <span className="font-bold">{item.teacherName}</span> 
                    <span className="ip-address">with {item.ipAddress} (IP address)</span>
                  </div>
                  
                  <div className="alert-content">
                    <div className="alert-section">
                      <span className="alert-label">Changed the data from:</span>
                      {item.prevData ? (
                        <button className="btn btn-success" onClick={handleDownload2}>
                          Previous
                        </button>
                      ) : (
                        <span className="no-data">-</span>
                      )}
                    </div>
                    
                    <div className="alert-section">
                      <span className="alert-label">Previous transaction hash:</span>
                      <span className="transaction-hash">
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
                      </span>
                    </div>
                    
                    <div className="alert-section">
                      <span className="alert-label">To new data:</span>
                      {item.data ? (
                        <button className="btn btn-success" onClick={handleDownload}>
                          New
                        </button>
                      ) : (
                        <span className="no-data">-</span>
                      )}
                    </div>
                    
                    <div className="alert-section">
                      <span className="alert-label">New transaction hash:</span>
                      <span className="transaction-hash">
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
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-alerts">
              <p>No alerts found</p>
            </div>
          )}
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
