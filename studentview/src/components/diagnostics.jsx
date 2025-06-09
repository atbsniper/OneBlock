import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const Diagnostics = () => {
  const [studentData, setStudentData] = useState(null);
  const [logGardEntries, setLogGardEntries] = useState([]);
  const [notificationsEntries, setNotificationsEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        setLoading(true);
        
        // Get student data from localStorage
        const storedStudentData = localStorage.getItem('studentData');
        if (storedStudentData) {
          const parsedStudentData = JSON.parse(storedStudentData);
          setStudentData(parsedStudentData);
          console.log("Student data found:", parsedStudentData);
        } else {
          console.log("No student data found in localStorage");
          setError("No student data found. Please log in first.");
        }
        
        // Check LogGard collection
        const logsRef = collection(db, "LogGard");
        const logsSnapshot = await getDocs(logsRef);
        const logs = [];
        
        logsSnapshot.forEach((doc) => {
          logs.push({ id: doc.id, ...doc.data() });
        });
        
        setLogGardEntries(logs);
        console.log(`Found ${logs.length} entries in LogGard collection`);
        
        // Check notifications collection
        const notificationsRef = collection(db, "notifications");
        const notificationsSnapshot = await getDocs(notificationsRef);
        const notifications = [];
        
        notificationsSnapshot.forEach((doc) => {
          notifications.push({ id: doc.id, ...doc.data() });
        });
        
        setNotificationsEntries(notifications);
        console.log(`Found ${notifications.length} entries in notifications collection`);
        
      } catch (err) {
        console.error("Error running diagnostics:", err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    runDiagnostics();
  }, []);
  
  if (loading) {
    return <div>Running diagnostics...</div>;
  }
  
  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Notifications Diagnostics</h1>
      
      <section>
        <h2>Student Data</h2>
        {studentData ? (
          <pre>{JSON.stringify(studentData, null, 2)}</pre>
        ) : (
          <p>No student data found in localStorage</p>
        )}
      </section>
      
      <section>
        <h2>LogGard Collection ({logGardEntries.length} entries)</h2>
        {logGardEntries.length > 0 ? (
          <div>
            {logGardEntries.map((log, index) => (
              <div key={log.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '10px 0',
                backgroundColor: '#f9f9f9'
              }}>
                <h3>Log Entry #{index + 1}</h3>
                <p><strong>ID:</strong> {log.id}</p>
                <p><strong>Action:</strong> {log.action || 'N/A'}</p>
                <p><strong>Teacher:</strong> {log.teacherName || 'N/A'}</p>
                <p><strong>Course ID:</strong> {log.courseId || 'N/A'}</p>
                <p><strong>Timestamp:</strong> {log.timestamp ? new Date(log.timestamp.seconds * 1000).toLocaleString() : 'N/A'}</p>
                <details>
                  <summary>View Full Data</summary>
                  <pre>{JSON.stringify(log, null, 2)}</pre>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p>No entries found in LogGard collection</p>
        )}
      </section>
      
      <section>
        <h2>Notifications Collection ({notificationsEntries.length} entries)</h2>
        {notificationsEntries.length > 0 ? (
          <div>
            {notificationsEntries.map((notification, index) => (
              <div key={notification.id} style={{ 
                border: '1px solid #ddd', 
                padding: '10px', 
                margin: '10px 0',
                backgroundColor: '#f9f9f9'
              }}>
                <h3>Notification #{index + 1}</h3>
                <p><strong>ID:</strong> {notification.id}</p>
                <p><strong>Title:</strong> {notification.title || 'N/A'}</p>
                <p><strong>Type:</strong> {notification.type || 'N/A'}</p>
                <p><strong>Student ID:</strong> {notification.studentId || 'N/A'}</p>
                <p><strong>Date:</strong> {notification.date ? new Date(notification.date.seconds * 1000).toLocaleString() : 'N/A'}</p>
                <details>
                  <summary>View Full Data</summary>
                  <pre>{JSON.stringify(notification, null, 2)}</pre>
                </details>
              </div>
            ))}
          </div>
        ) : (
          <p>No entries found in notifications collection</p>
        )}
      </section>
    </div>
  );
};

export default Diagnostics; 