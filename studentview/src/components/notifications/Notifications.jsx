import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell, 
  faArrowLeft,
  faCheckCircle,
  faExclamationCircle,
  faInfoCircle,
  faCalendarAlt,
  faGraduationCap,
  faBook,
  faEnvelope,
  faEnvelopeOpen,
  faSync,
  faUserTie,
  faClock,
  faEdit,
  faHistory,
  faNetworkWired,
  faDesktop,
  faSpinner,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import { db, getStudentCourses, getStudentGrades, getStudentAttendance } from '../../firebase/firebaseConfig';
import { collection, doc, updateDoc, getDocs, query, where, orderBy, onSnapshot, getDoc, Timestamp, limit } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Notifications.css';
import { getStudentNotifications } from '../../utils/notificationHelpers';

const Notifications = () => {
  const [studentData, setStudentData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [manualCheckEnabled, setManualCheckEnabled] = useState(false);
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get student data from localStorage
        const storedStudentData = localStorage.getItem('studentData');
        
        if (!storedStudentData) {
          toast.error("No student data found. Please log in again.");
          setLoading(false);
          return;
        }
        
        const parsedStudentData = JSON.parse(storedStudentData);
        
        if (!parsedStudentData.id) {
          toast.error("Invalid student data. Please log in again.");
          setLoading(false);
          return;
        }
        
        setStudentData(parsedStudentData);
        
        // Fetch notifications initially
        await fetchNotifications(parsedStudentData.id);
        
        // Set up real-time listener for the notifications collection
        setupNotificationsListener(parsedStudentData.id);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading notifications');
        setLoading(false);
      }
    };
    
    fetchStudentData();
    
    // Clean up listeners on unmount
    return () => {
      if (window.unsubscribeNotifications) window.unsubscribeNotifications();
    };
  }, []);
  
  const setupNotificationsListener = (studentId) => {
    if (!studentId) return;
    
    // Create a query for the notifications collection specific to this student
    const notificationsRef = collection(db, "notifications");
    const studentNotificationsQuery = query(
      notificationsRef, 
      where("studentId", "==", studentId),
      orderBy("timestamp", "desc") // Most recent first
    );
    
    // Store the current timestamp when listener is set up
    const listenerSetupTime = new Date().getTime();
    
    // Listen for changes
    window.unsubscribeNotifications = onSnapshot(studentNotificationsQuery, async (snapshot) => {
      let newNotificationFound = false;
      
      // Check if we have truly new documents (created after our listener was set up)
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const notificationData = change.doc.data();
          const notificationTimestamp = 
            notificationData.timestamp?.toDate?.() || 
            (typeof notificationData.timestamp === 'number' ? new Date(notificationData.timestamp) : null) ||
            notificationData.date || 
            new Date();
            
          const notificationTime = notificationTimestamp instanceof Date ? 
            notificationTimestamp.getTime() : new Date(notificationTimestamp).getTime();
          
          // Only consider it new if it was created after our listener was set up
          // Adding a 2-second buffer to avoid false positives
          if (notificationTime > listenerSetupTime - 2000) {
            console.log("Truly new notification detected:", notificationData);
            newNotificationFound = true;
          }
        }
      });
      
      // If we found a truly new notification, refresh the list and show toast
      if (newNotificationFound) {
        toast.info('New notifications received');
        if (studentData) {
          await fetchNotifications(studentData.id);
        }
      } else {
        // Just refresh the list without the toast for changes to existing notifications
        if (studentData && snapshot.docChanges().length > 0) {
          await fetchNotifications(studentData.id);
        }
      }
    }, (error) => {
      console.error('Error setting up Notifications listener:', error);
    });
  };
  
  // Get removed notifications from localStorage
  const getRemovedNotifications = () => {
    const removedNotificationsJSON = localStorage.getItem('removedNotifications');
    if (removedNotificationsJSON) {
      try {
        return JSON.parse(removedNotificationsJSON);
      } catch (e) {
        console.error('Error parsing removed notifications:', e);
        return [];
      }
    }
    return [];
  };
  
  // Fetch notifications from Firebase using our new helper function
  const fetchNotifications = async (studentId) => {
    if (!studentId) return;
    
    setLoading(true);
    const removedIds = getRemovedNotifications();
    
    try {
      console.log("Fetching notifications for student ID:", studentId);
      
      // Get notifications for this student
      const notificationsData = await getStudentNotifications(studentId);
      
      console.log("Raw notifications received:", notificationsData.length);
      
      // Check if we got any notifications back
      if (notificationsData.length === 0) {
        console.log("No notifications found with the primary student ID. This might be due to a mismatch between how notifications are created and retrieved.");
        
        // Try a direct query to see if there are any notifications in the system
        const notificationsRef = collection(db, "notifications");
        const allNotificationsSnapshot = await getDocs(notificationsRef);
        
        console.log(`Total notifications in Firestore: ${allNotificationsSnapshot.size}`);
        
        if (allNotificationsSnapshot.size > 0) {
          const studentIds = new Set();
          allNotificationsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.studentId) {
              studentIds.add(data.studentId);
              console.log(`Found notification with studentId: ${data.studentId}`);
            }
          });
          
          console.log("All studentIds with notifications:", [...studentIds]);
          
          // Look for notifications that might be using a different ID format
          let potentialNotifications = [];
          allNotificationsSnapshot.forEach(doc => {
            const data = doc.data();
            const notificationStudentId = data.studentId;
            
            // Check if the notification might be for this student but with a different ID format
            const isRollNumberMatch = studentId.includes('-') && notificationStudentId === studentId;
            const isFirebaseIdMatch = !studentId.includes('-') && notificationStudentId === studentId;
            
            // Try to match roll number in Firebase ID or vice versa
            const containedInOther = 
              (studentId.includes(notificationStudentId) || 
               notificationStudentId.includes(studentId)) && 
              studentId.length > 3 && 
              notificationStudentId.length > 3;
            
            if (isRollNumberMatch || isFirebaseIdMatch || containedInOther) {
              // This notification might be for this student
              const notificationDate = data.timestamp?.toDate() || data.date || new Date();
              
              potentialNotifications.push({
                id: doc.id,
                ...data,
                date: notificationDate instanceof Date ? notificationDate : new Date(notificationDate),
                timestamp: notificationDate instanceof Date ? notificationDate.getTime() : new Date(notificationDate).getTime()
              });
            }
          });
          
          if (potentialNotifications.length > 0) {
            console.log(`Found ${potentialNotifications.length} potential notifications for this student`);
            
            // Filter out removed notifications
            potentialNotifications = potentialNotifications.filter(
              notification => !removedIds.includes(notification.id)
            );
            
            console.log(`After removing previously dismissed: ${potentialNotifications.length} notifications`);
            
            // Sort by timestamp
            potentialNotifications.sort((a, b) => b.timestamp - a.timestamp);
            
            // Use these notifications
            setNotifications(potentialNotifications);
            setLoading(false);
            return;
          }
        }
      }
      
      // Continue with normal flow if notificationsData is not empty
      // Filter out removed notifications
      const filteredNotifications = notificationsData.filter(
        notification => !removedIds.includes(notification.id)
      );
      
      console.log(`Final notifications count: ${filteredNotifications.length}`);
      
      // Set the filtered notifications
      setNotifications(filteredNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Error loading notifications');
    } finally {
      setLoading(false);
    }
  };
  
  const handleRefresh = async () => {
    if (!studentData || refreshing) return;
    
    setRefreshing(true);
    try {
      // Fetch latest notifications
      await fetchNotifications(studentData.id);
      toast.success('Notifications refreshed');
    } catch (error) {
      console.error('Error refreshing notifications:', error);
      toast.error('Failed to refresh notifications');
    } finally {
      setRefreshing(false);
    }
  };
  
  const checkGradesAndAttendanceForNotifications = async () => {
    // Our new fetchNotifications already does this - it directly fetches from the 
    // attendance and grades collections, so we just need to call it
    handleRefresh();
  };
  
  const handleMarkAsRead = async (notificationId, event) => {
    // Prevent the click from propagating to parent elements
    if (event) {
      event.stopPropagation();
    }
    
    try {
      // Update the notification in Firestore
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true
      });
      
      // Save this notification ID to localStorage so it won't reappear on refresh
      const removedNotificationsJSON = localStorage.getItem('removedNotifications');
      let removedNotifications = [];
      
      if (removedNotificationsJSON) {
        try {
          removedNotifications = JSON.parse(removedNotificationsJSON);
        } catch (e) {
          console.error('Error parsing removed notifications:', e);
          removedNotifications = []; // Reset if parsing fails
        }
      }
      
      // Add this ID if not already in the list
      if (!removedNotifications.includes(notificationId)) {
        removedNotifications.push(notificationId);
        localStorage.setItem('removedNotifications', JSON.stringify(removedNotifications));
      }
      
      // Remove the notification from the list
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      toast.success('Notification removed');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      
      // Try to forcefully remove it from the list anyway
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== notificationId)
      );
      
      toast.success('Notification removed');
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(notification => !notification.read);
      
      if (unreadNotifications.length === 0 && notifications.length === 0) {
        toast.info('No notifications to remove');
        return;
      }
      
      // Save all notification IDs to localStorage so they won't reappear on refresh
      const removedNotificationsJSON = localStorage.getItem('removedNotifications');
      let removedNotifications = [];
      
      if (removedNotificationsJSON) {
        try {
          removedNotifications = JSON.parse(removedNotificationsJSON);
        } catch (e) {
          console.error('Error parsing removed notifications:', e);
          // If there's an error, reset the list
          removedNotifications = [];
        }
      }
      
      // Track which updates succeed
      const updatePromises = [];
      
      // Add each notification ID to the removed list and update Firestore
      for (const notification of notifications) {
        if (!removedNotifications.includes(notification.id)) {
          removedNotifications.push(notification.id);
          
          // Update in Firestore
          const notificationRef = doc(db, 'notifications', notification.id);
          updatePromises.push(updateDoc(notificationRef, { read: true })
            .catch(err => {
              console.error(`Error updating notification ${notification.id}:`, err);
              // Continue with next notification
            }));
        }
      }
      
      // Wait for all updates to complete
      await Promise.allSettled(updatePromises);
      
      // Save the updated list to localStorage
      localStorage.setItem('removedNotifications', JSON.stringify(removedNotifications));
      console.log(`Added ${notifications.length} notification IDs to removed list in localStorage`);
      
      // Remove all notifications from the UI
      setNotifications([]);
      
      toast.success(`All notifications removed`);
    } catch (error) {
      console.error('Error removing all notifications:', error);
      
      // Try to forcefully remove all anyway
      setNotifications([]);
      toast.success(`All notifications removed`);
    }
  };
  
  // Format date helper function
  const formatDate = (dateInput) => {
    // Make sure we have a valid Date object to work with
    let date;
    
    // Handle numeric timestamps (from timestamp field)
    if (typeof dateInput === 'number') {
      date = new Date(dateInput);
    }
    // Handle Date objects
    else if (dateInput instanceof Date) {
      date = dateInput;
    } 
    // Handle Firestore Timestamp objects
    else if (dateInput && typeof dateInput.toDate === 'function') {
      date = dateInput.toDate();
    } 
    // Handle string dates or ISO strings
    else if (dateInput && typeof dateInput === 'string') {
      date = new Date(dateInput);
    } 
    // Fallback
    else {
      console.warn('Invalid date format provided to formatDate:', dateInput);
      date = new Date();
    }
    
    // Validate the date is actually valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date produced in formatDate:', date);
      date = new Date();
    }
    
    const now = new Date();
    
    // If it's today, just show the time
    if (date.toDateString() === now.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If it's yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Otherwise show the full date
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'announcement':
        return faInfoCircle;
      case 'grade':
        return faGraduationCap;
      case 'attendance':
        return faCalendarAlt;
      case 'assignment':
        return faBook;
      default:
        return faBell;
    }
  };
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'announcement':
        return 'Announcement';
      case 'grade':
        return 'Grade Update';
      case 'attendance':
        return 'Attendance';
      case 'assignment':
        return 'Assignment';
      default:
        return 'Notification';
    }
  };
  
  const handleViewDetails = (notification) => {
    setSelectedNotification(notification);
  };
  
  const closeDetails = () => {
    setSelectedNotification(null);
  };
  
  const renderNotificationDetails = () => {
    if (!selectedNotification) return null;
    
    const { type, details, teacherName, date, courseId, isAlert } = selectedNotification;
    
    // Common header for all notification types
    const header = (
      <div className="notification-details-header">
        <div className="notification-type">
          {isAlert ? (
            <FontAwesomeIcon icon={faExclamationTriangle} />
          ) : (
            <FontAwesomeIcon icon={getNotificationIcon(type)} />
          )}
          <span>{isAlert ? '⚠️ ' : ''}{getTypeLabel(type)}{isAlert ? ' (Modified)' : ''}</span>
        </div>
        
        <button className="close-details-btn" onClick={closeDetails}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>
      </div>
    );
    
    // Common metadata for all notification types
    const metadata = (
      <div className="notification-metadata">
        {teacherName && (
          <div className="metadata-item">
            <FontAwesomeIcon icon={faUserTie} />
            <span><strong>Instructor:</strong> {teacherName}</span>
          </div>
        )}
        
        <div className="metadata-item">
          <FontAwesomeIcon icon={faClock} />
          <span><strong>Time:</strong> {formatDate(date)}</span>
        </div>
        
        {courseId && (
          <div className="metadata-item">
            <FontAwesomeIcon icon={faBook} />
            <span><strong>Course:</strong> {details?.courseName || courseId}</span>
          </div>
        )}
        
        {selectedNotification.ipAddress && (
          <div className="metadata-item">
            <FontAwesomeIcon icon={faNetworkWired} />
            <span><strong>IP Address:</strong> {selectedNotification.ipAddress}</span>
          </div>
        )}
        
        {selectedNotification.browser && (
          <div className="metadata-item">
            <FontAwesomeIcon icon={faDesktop} />
            <span><strong>Browser:</strong> {selectedNotification.browser}</span>
          </div>
        )}
      </div>
    );
    
    // Type-specific content
    let content;
    
    if (type === 'attendance') {
      // Attendance notification details
      const status = details?.status;
      const prevStatus = details?.previousStatus;
      const attendanceDate = details?.date;
      
      // Format the attendance date properly
      let formattedAttendanceDate = "";
      let day = details?.day || "";
      
      if (attendanceDate) {
        // Try to ensure we have a valid date object
        let dateObj;
        try {
          if (typeof attendanceDate === 'string') {
            // Handle different date formats
            if (attendanceDate.includes('T') || attendanceDate.includes('-')) {
              // ISO format
              dateObj = new Date(attendanceDate);
            } else if (attendanceDate.includes('/')) {
              // MM/DD/YYYY format
              const [month, day, year] = attendanceDate.split('/');
              dateObj = new Date(year, month - 1, day);
            } else {
              dateObj = new Date(attendanceDate);
            }
          } else if (attendanceDate instanceof Date) {
            dateObj = attendanceDate;
          } else if (attendanceDate && typeof attendanceDate.toDate === 'function') {
            dateObj = attendanceDate.toDate();
          } else {
            console.warn('Invalid attendance date format, using current date');
            dateObj = new Date();
          }
          
          // Verify date is valid
          if (isNaN(dateObj.getTime())) {
            console.warn('Invalid date produced from attendance date, using current date');
            dateObj = new Date();
          }
          
          // Format the date
          formattedAttendanceDate = dateObj.toLocaleDateString();
          
          // Get day of week if not provided
          if (!day) {
            day = dateObj.toLocaleDateString(undefined, { weekday: 'long' });
          }
        } catch (e) {
          console.error('Error formatting attendance date:', e);
          formattedAttendanceDate = new Date().toLocaleDateString();
          if (!day) day = new Date().toLocaleDateString(undefined, { weekday: 'long' });
        }
      }
      
      if (prevStatus) {
        // Show comparison view for modified attendance
        content = (
          <div className="notification-content attendance-details">
            <h3>Attendance Modified</h3>
            <div className="notification-comparison">
              <div className="comparison-column current-value">
                <div className="comparison-header">Current Status</div>
                <div className="comparison-content">
                  <div className={`status-badge ${status === 'present' ? 'present-status' : 'absent-status'}`}>
                    <FontAwesomeIcon icon={status === 'present' ? faCheckCircle : faExclamationCircle} />
                    <span>{status === 'present' ? 'Present' : 'Absent'}</span>
                  </div>
                  
                  {attendanceDate && (
                    <div className="attendance-date">
                      <strong>Date:</strong> {formattedAttendanceDate}
                      <span className="attendance-day"> ({day})</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="comparison-column previous-value">
                <div className="comparison-header">Previous Status</div>
                <div className="comparison-content">
                  <div className={`status-badge ${prevStatus === 'present' ? 'present-status' : 'absent-status'}`}>
                    <FontAwesomeIcon icon={prevStatus === 'present' ? faCheckCircle : faExclamationCircle} />
                    <span>{prevStatus === 'present' ? 'Present' : 'Absent'}</span>
                  </div>
                  
                  {attendanceDate && (
                    <div className="attendance-date">
                      <strong>Date:</strong> {formattedAttendanceDate}
                      <span className="attendance-day"> ({day})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <table className="notification-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Current Value</th>
                  <th>Previous Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Status</td>
                  <td className={status === 'present' ? 'present-status' : 'absent-status'}>
                    {status === 'present' ? 'Present' : 'Absent'}
                  </td>
                  <td className={prevStatus === 'present' ? 'present-status' : 'absent-status'}>
                    {prevStatus === 'present' ? 'Present' : 'Absent'}
                  </td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td colSpan="2">{formattedAttendanceDate} ({day})</td>
                </tr>
                <tr>
                  <td>Modified By</td>
                  <td colSpan="2">{teacherName || 'Instructor'}</td>
                </tr>
                <tr>
                  <td>Time of Modification</td>
                  <td colSpan="2">{formatDate(date)}</td>
                </tr>
                {details?.className && (
                  <tr>
                    <td>Class</td>
                    <td colSpan="2">{details.className}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      } else {
        // Regular attendance notification
        content = (
          <div className="notification-content attendance-details">
            <div className="attendance-status">
              <h3>Attendance Status</h3>
              <div className={`status-badge ${status === 'present' ? 'present-status' : 'absent-status'}`}>
                <FontAwesomeIcon icon={status === 'present' ? faCheckCircle : faExclamationCircle} />
                <span>{status === 'present' ? 'Present' : 'Absent'}</span>
              </div>
              
              {attendanceDate && (
                <div className="attendance-date">
                  <strong>Date:</strong> {formattedAttendanceDate}
                  <span className="attendance-day"> ({day})</span>
                </div>
              )}
            </div>
            
            <table className="notification-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Status</td>
                  <td className={status === 'present' ? 'present-status' : 'absent-status'}>
                    {status === 'present' ? 'Present' : 'Absent'}
                  </td>
                </tr>
                <tr>
                  <td>Date</td>
                  <td>{formattedAttendanceDate} ({day})</td>
                </tr>
                <tr>
                  <td>Day</td>
                  <td>{day}</td>
                </tr>
                <tr>
                  <td>Recorded By</td>
                  <td>{teacherName || 'Instructor'}</td>
                </tr>
                <tr>
                  <td>Time of Recording</td>
                  <td>{formatDate(date)}</td>
                </tr>
                {details?.className && (
                  <tr>
                    <td>Class</td>
                    <td>{details.className}</td>
                  </tr>
                )}
                {details?.courseName && (
                  <tr>
                    <td>Course</td>
                    <td>{details.courseName}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        );
      }
    } else if (type === 'grade') {
      // Grade notification details
      const { quizzes, assignments, midterm, final, quizAvg, assignmentAvg, component } = details || {};
      const previousGrades = details?.previousGrades;
      
      if (previousGrades) {
        // Show comparison for modified grades
        content = (
          <div className="notification-content grade-details">
            <h3>{component || 'Grade'} Modified</h3>
            
            {component === "Quiz" && quizzes && previousGrades.quizzes && (
              <>
                <div className="notification-comparison">
                  <div className="comparison-column current-value">
                    <div className="comparison-header">Current Quiz Scores</div>
                    <div className="comparison-content">
                      <div className="grade-items">
                        {quizzes.map((quiz, index) => (
                          <div className="grade-item" key={`quiz-${index}`}>
                            <span>Quiz {index + 1}:</span>
                            <span className="grade-value">{quiz || 'N/A'}</span>
                          </div>
                        ))}
                        {quizAvg !== undefined && (
                          <div className="grade-item average">
                            <span>Average:</span>
                            <span className="grade-value">{quizAvg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="comparison-column previous-value">
                    <div className="comparison-header">Previous Quiz Scores</div>
                    <div className="comparison-content">
                      <div className="grade-items">
                        {previousGrades.quizzes.map((quiz, index) => (
                          <div className="grade-item" key={`prev-quiz-${index}`}>
                            <span>Quiz {index + 1}:</span>
                            <span className="grade-value">{quiz || 'N/A'}</span>
                          </div>
                        ))}
                        {previousGrades.quizAvg !== undefined && (
                          <div className="grade-item average">
                            <span>Average:</span>
                            <span className="grade-value">{previousGrades.quizAvg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <table className="notification-table">
                  <thead>
                    <tr>
                      <th>Quiz</th>
                      <th>Current Score</th>
                      <th>Previous Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz, index) => {
                      const prevQuiz = previousGrades.quizzes[index] || 'N/A';
                      return (
                        <tr key={`quiz-row-${index}`}>
                          <td>Quiz {index + 1}</td>
                          <td>{quiz || 'N/A'}</td>
                          <td>{prevQuiz}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td><strong>Average</strong></td>
                      <td><strong>{quizAvg}</strong></td>
                      <td><strong>{previousGrades.quizAvg}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            
            {component === "Assignment" && assignments && previousGrades.assignments && (
              <>
                <div className="notification-comparison">
                  <div className="comparison-column current-value">
                    <div className="comparison-header">Current Assignment Scores</div>
                    <div className="comparison-content">
                      <div className="grade-items">
                        {assignments.map((assignment, index) => (
                          <div className="grade-item" key={`assignment-${index}`}>
                            <span>Assignment {index + 1}:</span>
                            <span className="grade-value">{assignment || 'N/A'}</span>
                          </div>
                        ))}
                        {assignmentAvg !== undefined && (
                          <div className="grade-item average">
                            <span>Average:</span>
                            <span className="grade-value">{assignmentAvg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="comparison-column previous-value">
                    <div className="comparison-header">Previous Assignment Scores</div>
                    <div className="comparison-content">
                      <div className="grade-items">
                        {previousGrades.assignments.map((assignment, index) => (
                          <div className="grade-item" key={`prev-assignment-${index}`}>
                            <span>Assignment {index + 1}:</span>
                            <span className="grade-value">{assignment || 'N/A'}</span>
                          </div>
                        ))}
                        {previousGrades.assignmentAvg !== undefined && (
                          <div className="grade-item average">
                            <span>Average:</span>
                            <span className="grade-value">{previousGrades.assignmentAvg}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <table className="notification-table">
                  <thead>
                    <tr>
                      <th>Assignment</th>
                      <th>Current Score</th>
                      <th>Previous Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((assignment, index) => {
                      const prevAssignment = previousGrades.assignments[index] || 'N/A';
                      return (
                        <tr key={`assignment-row-${index}`}>
                          <td>Assignment {index + 1}</td>
                          <td>{assignment || 'N/A'}</td>
                          <td>{prevAssignment}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td><strong>Average</strong></td>
                      <td><strong>{assignmentAvg}</strong></td>
                      <td><strong>{previousGrades.assignmentAvg}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </>
            )}
            
            {component === "Midterm" && (
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Current Score</th>
                    <th>Previous Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Midterm</td>
                    <td>{midterm || 'N/A'}</td>
                    <td>{previousGrades.midterm || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {component === "Final" && (
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Current Score</th>
                    <th>Previous Score</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Final</td>
                    <td>{final || 'N/A'}</td>
                    <td>{previousGrades.final || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            {(!component || component === "Grades") && (
              <table className="notification-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Current Score</th>
                    <th>Previous Score</th>
                  </tr>
                </thead>
                <tbody>
                  {quizAvg !== undefined && previousGrades.quizAvg !== undefined && (
                    <tr>
                      <td>Quizzes (Avg)</td>
                      <td>{quizAvg}</td>
                      <td>{previousGrades.quizAvg}</td>
                    </tr>
                  )}
                  {assignmentAvg !== undefined && previousGrades.assignmentAvg !== undefined && (
                    <tr>
                      <td>Assignments (Avg)</td>
                      <td>{assignmentAvg}</td>
                      <td>{previousGrades.assignmentAvg}</td>
                    </tr>
                  )}
                  <tr>
                    <td>Midterm</td>
                    <td>{midterm || 'N/A'}</td>
                    <td>{previousGrades.midterm || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>Final</td>
                    <td>{final || 'N/A'}</td>
                    <td>{previousGrades.final || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            )}
            
            <div className="modification-info">
              <p><strong>Modified By:</strong> {teacherName || 'Instructor'}</p>
              <p><strong>Time of Modification:</strong> {formatDate(date)}</p>
            </div>
          </div>
        );
      } else {
        // Regular grade notification
        content = (
          <div className="notification-content grade-details">
            <div className="current-grades">
              <h3>Updated Grades</h3>
              
              <div className="grade-section">
                <h4>Quizzes</h4>
                <div className="grade-items">
                  {quizzes && quizzes.map((quiz, index) => (
                    <div className="grade-item" key={`quiz-${index}`}>
                      <span>Quiz {index + 1}:</span>
                      <span className="grade-value">{quiz || 'N/A'}</span>
                    </div>
                  ))}
                  {quizAvg !== undefined && (
                    <div className="grade-item average">
                      <span>Average:</span>
                      <span className="grade-value">{quizAvg}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grade-section">
                <h4>Assignments</h4>
                <div className="grade-items">
                  {assignments && assignments.map((assignment, index) => (
                    <div className="grade-item" key={`assignment-${index}`}>
                      <span>Assignment {index + 1}:</span>
                      <span className="grade-value">{assignment || 'N/A'}</span>
                    </div>
                  ))}
                  {assignmentAvg !== undefined && (
                    <div className="grade-item average">
                      <span>Average:</span>
                      <span className="grade-value">{assignmentAvg}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grade-section">
                <h4>Exams</h4>
                <div className="grade-items">
                  <div className="grade-item">
                    <span>Midterm:</span>
                    <span className="grade-value">{midterm || 'N/A'}</span>
                  </div>
                  <div className="grade-item">
                    <span>Final:</span>
                    <span className="grade-value">{final || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grade-info">
              <p><strong>Recorded By:</strong> {teacherName || 'Instructor'}</p>
              <p><strong>Time of Recording:</strong> {formatDate(date)}</p>
            </div>
          </div>
        );
      }
    } else {
      // Generic content for other notification types
      content = (
        <div className="notification-content">
          <p>{selectedNotification.message}</p>
        </div>
      );
    }
    
    return (
      <div className="notification-details">
        {header}
        {metadata}
        {content}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="notifications-page loading">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="notifications-page">
      {selectedNotification ? (
        renderNotificationDetails()
      ) : (
        <>
          <div className="notifications-header">
            <div className="notifications-title">
              <h1>
                <FontAwesomeIcon icon={faBell} />
                Notifications
              </h1>
              <p>Stay updated with your academic progress</p>
            </div>
            
            <div className="notifications-actions">
              <button 
                className="refresh-btn" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <FontAwesomeIcon icon={refreshing ? faSpinner : faSync} spin={refreshing} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
              
              <button 
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                disabled={notifications.length === 0}
              >
                <FontAwesomeIcon icon={faEnvelopeOpen} />
                Remove All
              </button>
            </div>
          </div>
          
          {notifications.length === 0 ? (
            <div className="no-notifications">
              <FontAwesomeIcon icon={faBell} size="3x" />
              <p>You don't have any notifications yet</p>
              <button 
                className="check-grades-btn"
                onClick={handleRefresh}
              >
                <FontAwesomeIcon icon={faGraduationCap} />
                Check for updates
              </button>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map(notification => {
                return (
                  <div 
                    key={notification.id}
                    className={`notification-card ${notification.read ? 'read' : 'unread'}`}
                  >
                    <div className="notification-icon">
                      <FontAwesomeIcon icon={getNotificationIcon(notification.type)} />
                    </div>
                    
                    <div className="notification-content">
                      <div className="notification-header">
                        <h3>{notification.title}</h3>
                        <span className="notification-date">
                          {formatDate(notification.timestamp ? notification.timestamp : notification.date)}
                        </span>
                      </div>
                      
                      <p className="notification-message">{notification.message}</p>
                      
                      <div className="notification-metadata">
                        {notification.courseId && (
                          <span className="course-tag">
                            <FontAwesomeIcon icon={faBook} />
                            {notification.details?.courseName || notification.courseId}
                          </span>
                        )}
                        
                        {notification.teacherName && (
                          <span className="teacher-tag">
                            <FontAwesomeIcon icon={faUserTie} />
                            {notification.teacherName}
                          </span>
                        )}
                        
                        <span className="type-tag">
                          {getTypeLabel(notification.type)}
                        </span>
                      </div>
                      
                      <div className="notification-actions">
                        <button 
                          className="view-details-btn"
                          onClick={() => handleViewDetails(notification)}
                        >
                          View Details
                        </button>
                        
                        <button 
                          className="mark-read-btn"
                          onClick={(e) => handleMarkAsRead(notification.id, e)}
                        >
                          <FontAwesomeIcon icon={faEnvelopeOpen} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="back-button-container">
            <Link to="/dashboard" className="back-button">
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Notifications;