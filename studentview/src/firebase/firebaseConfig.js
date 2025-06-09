import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, where, doc, getDoc, addDoc, serverTimestamp } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDFt0rjaA2EXpwMk0KyyI01HOKx7JNn2FE",
  authDomain: "oneblock-e3742.firebaseapp.com",
  projectId: "oneblock-e3742",
  storageBucket: "oneblock-e3742.firebasestorage.app",
  messagingSenderId: "531374953707",
  appId: "1:531374953707:web:2c7aa24c05a43ffab39aae",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Function to get a student by ID
export const getStudentById = async (studentId) => {
  const q = query(collection(db, "students"), where("id", "==", studentId));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  }
  
  return null;
};

// Function to get all students
export const getStudents = async () => {
  let students = [];
  const querySnapshot = await getDocs(collection(db, "students"));
  querySnapshot.forEach((doc) => {
    students.push(doc.data());
  });
  return students;
};

// Function to get courses for a student
export const getStudentCourses = async (studentId) => {
  try {
    // For now, we'll just return all courses from attendance and grades collections
    // since we're not tracking course enrollment yet
    
    // Get courses from attendance collection
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    
    // Get courses from grades collection
    const gradesSnapshot = await getDocs(collection(db, "grades"));
    
    const courseIds = new Set();
    const courses = [];
    
    // Add courses from attendance collection
    attendanceSnapshot.forEach((doc) => {
      if (!courseIds.has(doc.id)) {
        courseIds.add(doc.id);
        courses.push({ 
          id: doc.id, 
          name: `Course ${doc.id}`, // Default name based on ID
        });
      }
    });
    
    // Add courses from grades collection
    gradesSnapshot.forEach((doc) => {
      if (!courseIds.has(doc.id)) {
        courseIds.add(doc.id);
        courses.push({ 
          id: doc.id, 
          name: `Course ${doc.id}`, // Default name based on ID
        });
      }
    });
    
    return courses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
};

// Function to get attendance records for a student from the instructor's system
export const getStudentAttendance = async (studentId, courseId) => {
  try {
    // Get student data to find the roll number
    const storedStudentData = localStorage.getItem('studentData');
    if (!storedStudentData) {
      return [];
    }
    
    const studentData = JSON.parse(storedStudentData);
    const rollNo = studentData.rollNo;
    
    if (!rollNo) {
      console.error('Student roll number not found');
      return [];
    }
    
    // Get attendance data from the instructor's attendance collection
    const attendanceDocRef = doc(db, "attendance", courseId);
    const attendanceDoc = await getDoc(attendanceDocRef);
    
    if (!attendanceDoc.exists()) {
      return [];
    }
    
    const attendanceData = attendanceDoc.data();
    const attendanceRecords = [];
    
    // Process each attendance date
    for (const date in attendanceData) {
      const dateAttendance = attendanceData[date];
      
      // Check if the student's roll number exists in this date's attendance
      if (dateAttendance[rollNo]) {
        attendanceRecords.push({
          date: date,
          status: dateAttendance[rollNo].isPresent ? 'present' : 'absent',
          name: dateAttendance[rollNo].name || studentData.name
        });
      }
    }
    
    return attendanceRecords;
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return [];
  }
};

// Function to get grades for a student from the instructor's system
export const getStudentGrades = async (studentId, courseId) => {
  try {
    // Get student data to find the roll number
    const storedStudentData = localStorage.getItem('studentData');
    if (!storedStudentData) {
      return [];
    }
    
    const studentData = JSON.parse(storedStudentData);
    const rollNo = studentData.rollNo;
    
    if (!rollNo) {
      console.error('Student roll number not found');
      return [];
    }
    
    // Get grades data from the instructor's grades collection
    const gradesDocRef = doc(db, "grades", courseId);
    const gradesDoc = await getDoc(gradesDocRef);
    
    if (!gradesDoc.exists()) {
      return [];
    }
    
    const gradesData = gradesDoc.data();
    
    // Check if the student's roll number exists in the grades
    if (gradesData[rollNo]) {
      const studentGrades = gradesData[rollNo];
      
      // Calculate averages
      const quizAvg = calculateAverage(studentGrades.quiz || []);
      const assignmentAvg = calculateAverage(studentGrades.assignment || []);
      const midterm = studentGrades.mid || 0;
      const final = studentGrades.final || 0;
      
      // Calculate overall grade (simple average for now)
      const overallGrade = calculateOverallGrade(quizAvg, assignmentAvg, midterm, final);
      
      return [{
        id: courseId,
        studentId: studentId,
        courseId: courseId,
        quizzes: quizAvg,
        assignments: assignmentAvg,
        midterm: midterm,
        final: final,
        overall: overallGrade,
        quizDetails: studentGrades.quiz || [],
        assignmentDetails: studentGrades.assignment || []
      }];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching grades:', error);
    return [];
  }
};

// Helper function to calculate average from an array of values
const calculateAverage = (values) => {
  if (!values || values.length === 0) return 0;
  
  const sum = values.reduce((total, val) => {
    const numVal = Number(val) || 0;
    return total + numVal;
  }, 0);
  
  return Math.round(sum / values.length);
};

// Helper function to calculate overall grade with weights
const calculateOverallGrade = (quizAvg, assignmentAvg, midterm, final) => {
  // Weights: Quizzes 20%, Assignments 30%, Midterm 20%, Final 30%
  const weights = { quiz: 0.2, assignment: 0.3, midterm: 0.2, final: 0.3 };
  
  return Math.round(
    (quizAvg * weights.quiz) + 
    (assignmentAvg * weights.assignment) + 
    (midterm * weights.midterm) + 
    (final * weights.final)
  );
};

// Function to get notifications for a student
export const getStudentNotifications = async (studentId) => {
  try {
    // Get student data to find the roll number
    const storedStudentData = localStorage.getItem('studentData');
    if (!storedStudentData) {
      console.error('No student data found in localStorage');
      return [];
    }
    
    const studentData = JSON.parse(storedStudentData);
    const rollNo = studentData.rollNo;
    
    if (!rollNo) {
      console.error('Student roll number not found');
      return [];
    }
    
    console.log('Fetching notifications for roll number:', rollNo);
    
    // Check for removed notifications in localStorage
    let removedNotifications = [];
    const removedNotificationsJSON = localStorage.getItem('removedNotifications');
    if (removedNotificationsJSON) {
      try {
        removedNotifications = JSON.parse(removedNotificationsJSON);
        console.log('Found removed notifications in localStorage:', removedNotifications);
      } catch (e) {
        console.error('Error parsing removed notifications:', e);
        // If there's an error parsing, reset the storage
        localStorage.setItem('removedNotifications', JSON.stringify([]));
        removedNotifications = [];
      }
    } else {
      // Initialize if not exists
      localStorage.setItem('removedNotifications', JSON.stringify([]));
    }
    
    // First, get all notifications directly related to the student ID from notifications collection
    const notificationsRef = collection(db, "notifications");
    const userNotificationsQuery = query(
      notificationsRef, 
      where("studentId", "==", studentId)
    );
    
    const userQuerySnapshot = await getDocs(userNotificationsQuery);
    let notifications = [];
    
    userQuerySnapshot.forEach((doc) => {
      // Skip removed notifications
      if (!removedNotifications.includes(doc.id)) {
        notifications.push({ id: doc.id, ...doc.data() });
      }
    });
    
    console.log(`Found ${notifications.length} notifications in the notifications collection`);
    
    // Next, check for attendance and grade notifications by rollNo in the LogGard collection
    const logsRef = collection(db, "LogGard");
    const logsSnapshot = await getDocs(logsRef);
    let logNotificationsCount = 0;
    
    console.log(`Found ${logsSnapshot.size} total logs in LogGard collection`);
    
    logsSnapshot.forEach((doc) => {
      // Skip removed notifications
      if (removedNotifications.includes(doc.id)) {
        console.log(`Skipping removed notification with ID ${doc.id}`);
        return;
      }
      
      const logData = doc.data();
      console.log(`Processing log: ${doc.id}`, logData);
      
      try {
        // Ensure logData.data exists and contains the student's roll number
        // For attendance logs - Improve action type detection to catch all attendance variants
        if (logData.action === "attendance" || 
            logData.action === "attendence" || 
            logData.action === "mark_attendance" || 
            logData.action === "mark_attendence" || 
            logData.actionType === "attendance" ||
            logData.type === "attendance" ||
            (logData.action && logData.action.toLowerCase().includes('attend'))) {
          
          console.log(`Detected attendance log with action: ${logData.action}, ID: ${doc.id}`);
          let studentData = null;
          
          // Check if data is a string that needs parsing
          if (typeof logData.data === 'string' && logData.data.trim() !== '') {
            try {
              const parsedData = JSON.parse(logData.data);
              console.log(`Parsed attendance data for log ${doc.id}:`, parsedData);
              if (parsedData && parsedData[rollNo]) {
                studentData = parsedData[rollNo];
                console.log(`Found student data for roll ${rollNo} in attendance log:`, studentData);
              } else {
                console.log(`Roll ${rollNo} not found in attendance data:`, Object.keys(parsedData || {}));
              }
            } catch (e) {
              console.error('Error parsing log data:', e);
            }
          } else if (logData.data && logData.data[rollNo]) {
            // Data is already an object
            studentData = logData.data[rollNo];
            console.log(`Found student data for roll ${rollNo} in attendance log (object):`, studentData);
          } else if (logData.data) {
            console.log(`Roll ${rollNo} not found in attendance data (object):`, Object.keys(logData.data || {}));
          } else if (logData[rollNo]) {
            // Try direct access for older logs
            studentData = logData[rollNo];
            console.log(`Found student data using direct access for roll ${rollNo}:`, studentData);
          }
          
          // If student data was found, create a notification
          if (studentData) {
            logNotificationsCount++;
            // Handle boolean or string attendance status
            const isPresent = studentData.isPresent === true || 
                            studentData.isPresent === "true" || 
                            studentData.status === "present" ||
                            studentData.present === true;
                            
            const formattedDate = logData.date ? 
              new Date(logData.date).toLocaleDateString() : 
              new Date().toLocaleDateString();
            
            // Ensure we capture the ACTUAL timestamp when the action was performed
            // Added more priority sources for the action timestamp
            let notificationDate;
            
            // The actionTime or createdAt in the log is the most accurate time for when the instructor
            // actually took the action, so prioritize those fields
            if (logData.actionTime) {
              if (typeof logData.actionTime === 'object' && typeof logData.actionTime.toDate === 'function') {
                notificationDate = logData.actionTime.toDate();
              } else {
                notificationDate = new Date(logData.actionTime);
              }
              console.log(`Using actionTime for notification ${doc.id}:`, notificationDate);
            } 
            else if (logData.createdAt) {
              if (typeof logData.createdAt === 'object' && typeof logData.createdAt.toDate === 'function') {
                notificationDate = logData.createdAt.toDate();
              } else {
                notificationDate = new Date(logData.createdAt);
              }
              console.log(`Using createdAt for notification ${doc.id}:`, notificationDate);
            }
            // Fall back to timestamp if action time not available
            else if (logData.timestamp) {
              if (typeof logData.timestamp === 'object' && typeof logData.timestamp.toDate === 'function') {
                notificationDate = logData.timestamp.toDate();
              } else {
                notificationDate = new Date(logData.timestamp);
              }
              console.log(`Using timestamp for notification ${doc.id}:`, notificationDate);
            }
            // Try to extract timestamp from the document ID if it's in a timestamp format
            else if (doc.id.includes('-')) {
              try {
                const timestampPart = doc.id.split('-')[0];
                if (!isNaN(Number(timestampPart))) {
                  notificationDate = new Date(Number(timestampPart));
                  console.log(`Using timestamp from ID for notification ${doc.id}:`, notificationDate);
                } else {
                  notificationDate = new Date(); // Current time as fallback
                  console.log(`ID format not recognized for time extraction, using current time for ${doc.id}`);
                }
              } catch (e) {
                console.error(`Error extracting timestamp from ID ${doc.id}:`, e);
                notificationDate = new Date();
              }
            } 
            // Absolute last resort: current time
            else {
              notificationDate = new Date();
              console.log(`No timestamp information found for ${doc.id}, using current time`);
            }
            
            // Validate the date
            if (!notificationDate || isNaN(notificationDate.getTime())) {
              console.warn(`Invalid date for ${doc.id}, using current time instead`);
              notificationDate = new Date();
            }
            
            // Log the final date being used for debugging
            console.log(`Final date for notification ${doc.id}:`, notificationDate.toISOString());
            
            // Get instructor name with all possible fallbacks
            let instructorName = logData.teacherName || 
                                logData.instructorName || 
                                logData.userName || 
                                (logData.user && logData.user.name) || 
                                (logData.instructor && logData.instructor.name) || 
                                'Instructor';
                
            const notificationData = {
              id: doc.id,
              date: notificationDate,
              title: `Attendance ${logData.type === 'alert' ? 'updated' : 'recorded'} by ${instructorName}`,
              message: `Your attendance has been marked as ${isPresent ? 'present' : 'absent'} for ${logData.courseId || 'course'} on ${formattedDate}`,
              type: 'attendance',
              courseId: logData.courseId || 'unknown',
              read: false,
              teacherName: instructorName,
              ipAddress: logData.ipAddress || 'unknown',
              browser: logData.detectedBrowser || 'unknown',
              details: {
                status: isPresent ? 'present' : 'absent',
                date: logData.date || new Date().toISOString().split('T')[0],
                className: logData.className || '',
                courseName: logData.courseName || logData.courseId || 'unknown',
                day: new Date(logData.date || Date.now()).toLocaleDateString(undefined, { weekday: 'long' })
              },
              isAlert: logData.type === 'alert',
              actualActionTime: notificationDate.getTime() // Store the actual timestamp for consistent sorting
            };
            
            // If this is an update (alert type), add the previous state
            if (logData.type === 'alert' && logData.prevData) {
              let prevStudentData = null;
              
              // Check if prevData is a string that needs parsing
              if (typeof logData.prevData === 'string' && logData.prevData.trim() !== '') {
                try {
                  const parsedPrevData = JSON.parse(logData.prevData);
                  if (parsedPrevData && parsedPrevData[rollNo]) {
                    prevStudentData = parsedPrevData[rollNo];
                  }
                } catch (e) {
                  console.error('Error parsing previous data:', e);
                }
              } else if (logData.prevData && logData.prevData[rollNo]) {
                // PrevData is already an object
                prevStudentData = logData.prevData[rollNo];
              }
              
              if (prevStudentData) {
                const wasPresentBefore = prevStudentData.isPresent === true || 
                                        prevStudentData.isPresent === "true" || 
                                        prevStudentData.status === "present" ||
                                        prevStudentData.present === true;
                                        
                notificationData.details.previousStatus = wasPresentBefore ? 'present' : 'absent';
                notificationData.message = `Your attendance has been changed from ${notificationData.details.previousStatus} to ${notificationData.details.status} for ${logData.courseId || 'course'} on ${formattedDate}`;
                notificationData.title = `⚠️ Attendance modified by ${instructorName}`;
              }
            }
            
            notifications.push(notificationData);
            console.log(`Added attendance notification for log ${doc.id}`);
          }
        }
        
        // For grade logs
        if (logData.action === "grading") {
          let studentGrades = null;
          
          console.log(`Processing grade log ${doc.id} for roll ${rollNo}`, logData);
          
          // Check if data is a string that needs parsing
          if (typeof logData.data === 'string' && logData.data.trim() !== '') {
            try {
              const parsedData = JSON.parse(logData.data);
              console.log(`Parsed grading data for log ${doc.id}:`, parsedData);
              if (parsedData && parsedData[rollNo]) {
                studentGrades = parsedData[rollNo];
                console.log(`Found student grades for roll ${rollNo} in grading log:`, studentGrades);
              } else {
                console.log(`Roll ${rollNo} not found in grading data:`, Object.keys(parsedData || {}));
              }
            } catch (e) {
              console.error('Error parsing grade data:', e);
            }
          } else if (logData.data && logData.data[rollNo]) {
            // Data is already an object
            studentGrades = logData.data[rollNo];
            console.log(`Found student grades for roll ${rollNo} in grading log (object):`, studentGrades);
          } else if (logData.data) {
            console.log(`Roll ${rollNo} not found in grading data (object):`, Object.keys(logData.data || {}));
          } else {
            console.log(`No data field found in grading log ${doc.id}`);
          }
          
          if (studentGrades) {
            logNotificationsCount++;
            const quizAvg = calculateAverage(studentGrades.quiz || []);
            const assignmentAvg = calculateAverage(studentGrades.assignment || []);
            
            // Use the actual timestamp from the log data if available
            // This ensures we use the original action time, not current time
            let notificationDate;
            if (logData.timestamp) {
              if (typeof logData.timestamp.toDate === 'function') {
                notificationDate = logData.timestamp.toDate();
              } else if (typeof logData.timestamp === 'string') {
                notificationDate = new Date(logData.timestamp);
              } else if (logData.timestamp instanceof Date) {
                notificationDate = logData.timestamp;
              } else if (typeof logData.timestamp === 'number') {
                notificationDate = new Date(logData.timestamp);
              } else {
                // Default to the log data's originalTimestamp if available, otherwise current time
                notificationDate = logData.originalTimestamp 
                  ? new Date(logData.originalTimestamp) 
                  : new Date();
              }
            } else {
              // If no timestamp is available, use current time as last resort
              notificationDate = new Date();
            }
            
            // Log the date we're using for debugging
            console.log(`Using date for notification ${doc.id}:`, notificationDate);
            
            // Determine what component was updated
            let componentUpdated = "";
            if (logData.component) {
              componentUpdated = logData.component;
            } else if (logData.fieldName) {
              // Handle potential field names based on common patterns
              if (logData.fieldName.includes('quiz')) componentUpdated = "Quiz";
              else if (logData.fieldName.includes('assignment')) componentUpdated = "Assignment";
              else if (logData.fieldName.includes('mid')) componentUpdated = "Midterm";
              else if (logData.fieldName.includes('final')) componentUpdated = "Final";
              else componentUpdated = "Grades";
            } else {
              componentUpdated = "Grades";
            }
            
            const notificationData = {
              id: doc.id,
              date: notificationDate,
              title: `${componentUpdated} ${logData.type === 'alert' ? 'modified' : 'updated'} by ${logData.teacherName || 'instructor'}`,
              message: `Your ${componentUpdated.toLowerCase()} ${logData.type === 'alert' ? 'have been modified' : 'have been updated'} for course ${logData.courseId || 'unknown'}`,
              type: 'grade',
              courseId: logData.courseId || 'unknown',
              read: false,
              teacherName: logData.teacherName || 'instructor',
              ipAddress: logData.ipAddress || 'unknown',
              browser: logData.detectedBrowser || 'unknown',
              details: {
                quizzes: studentGrades.quiz || [],
                assignments: studentGrades.assignment || [],
                midterm: studentGrades.mid || 0,
                final: studentGrades.final || 0,
                quizAvg: quizAvg,
                assignmentAvg: assignmentAvg,
                className: logData.className || '',
                courseName: logData.courseName || logData.courseId || 'unknown',
                component: componentUpdated
              },
              isAlert: logData.type === 'alert'
            };
            
            // If this is an update (alert type), add the previous state
            if (logData.type === 'alert' && logData.prevData) {
              let prevGrades = null;
              
              // Check if prevData is a string that needs parsing
              if (typeof logData.prevData === 'string' && logData.prevData.trim() !== '') {
                try {
                  const parsedPrevData = JSON.parse(logData.prevData);
                  if (parsedPrevData && parsedPrevData[rollNo]) {
                    prevGrades = parsedPrevData[rollNo];
                  }
                } catch (e) {
                  console.error('Error parsing previous grade data:', e);
                }
              } else if (logData.prevData && logData.prevData[rollNo]) {
                // PrevData is already an object
                prevGrades = logData.prevData[rollNo];
              }
              
              if (prevGrades) {
                const prevQuizAvg = calculateAverage(prevGrades.quiz || []);
                const prevAssignmentAvg = calculateAverage(prevGrades.assignment || []);
                
                notificationData.details.previousGrades = {
                  quizzes: prevGrades.quiz || [],
                  assignments: prevGrades.assignment || [],
                  midterm: prevGrades.mid || 0,
                  final: prevGrades.final || 0,
                  quizAvg: prevQuizAvg,
                  assignmentAvg: prevAssignmentAvg
                };
                notificationData.title = `⚠️ ${componentUpdated} modified by ${logData.teacherName || 'instructor'}`;
                
                // Create a more descriptive message about what changed
                if (componentUpdated === "Quiz" && prevGrades.quiz) {
                  const oldQuiz = prevGrades.quiz;
                  const newQuiz = studentGrades.quiz;
                  if (oldQuiz.length !== newQuiz.length) {
                    notificationData.message = `A new quiz score has been added for course ${logData.courseId || 'unknown'}`;
                  } else {
                    notificationData.message = `Your quiz scores have been modified for course ${logData.courseId || 'unknown'}`;
                  }
                } else if (componentUpdated === "Assignment" && prevGrades.assignment) {
                  const oldAssignment = prevGrades.assignment;
                  const newAssignment = studentGrades.assignment;
                  if (oldAssignment.length !== newAssignment.length) {
                    notificationData.message = `A new assignment score has been added for course ${logData.courseId || 'unknown'}`;
                  } else {
                    notificationData.message = `Your assignment scores have been modified for course ${logData.courseId || 'unknown'}`;
                  }
                } else if (componentUpdated === "Midterm") {
                  notificationData.message = `Your midterm grade has been changed from ${prevGrades.mid || 0} to ${studentGrades.mid || 0} for course ${logData.courseId || 'unknown'}`;
                } else if (componentUpdated === "Final") {
                  notificationData.message = `Your final exam grade has been changed from ${prevGrades.final || 0} to ${studentGrades.final || 0} for course ${logData.courseId || 'unknown'}`;
                }
              }
            }
            
            notifications.push(notificationData);
            console.log(`Added grade notification for log ${doc.id}`);
          }
        }
      } catch (error) {
        console.error(`Error processing log entry ${doc.id}:`, error, logData);
      }
    });
    
    console.log(`Added ${logNotificationsCount} notifications from LogGard collection`);
    
    // If no notifications were found in LogGard, try to fetch recent grades directly
    if (logNotificationsCount === 0) {
      console.log("No notifications found in LogGard, checking grades collection directly");
      await checkGradesForNotifications(rollNo, notifications);
    }
    
    console.log(`Total notifications after all checks: ${notifications.length}`);
    
    // Sort by date (most recent first)
    notifications.sort((a, b) => {
      // Ensure we're using consistent date objects
      let dateA = a.date;
      let dateB = b.date;
      
      // Handle Firestore Timestamp objects
      if (dateA && typeof dateA.toDate === 'function') {
        dateA = dateA.toDate();
      } else if (!(dateA instanceof Date)) {
        dateA = new Date(dateA || 0);
      }
      
      if (dateB && typeof dateB.toDate === 'function') {
        dateB = dateB.toDate();
      } else if (!(dateB instanceof Date)) {
        dateB = new Date(dateB || 0);
      }
      
      // Compare the dates (most recent first)
      return dateB.getTime() - dateA.getTime();
    });
    
    console.log('Notifications sorted by date (most recent first):', 
      notifications.map(n => ({
        id: n.id,
        date: n.date instanceof Date ? n.date.toISOString() : new Date(n.date).toISOString(),
        title: n.title
      }))
    );
    
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Function to check grades directly and generate notifications if needed
const checkGradesForNotifications = async (rollNo, notifications) => {
  try {
    // Get removed notifications from localStorage
    let removedNotifications = [];
    const removedNotificationsJSON = localStorage.getItem('removedNotifications');
    if (removedNotificationsJSON) {
      try {
        removedNotifications = JSON.parse(removedNotificationsJSON);
      } catch (e) {
        console.error('Error parsing removed notifications:', e);
      }
    }
    
    // Get all courses from the grades collection
    const gradesSnapshot = await getDocs(collection(db, "grades"));
    
    console.log(`Checking ${gradesSnapshot.size} courses in grades collection`);
    let notificationsAdded = false;
    
    for (const gradeDoc of gradesSnapshot.docs) {
      const courseId = gradeDoc.id;
      const gradesData = gradeDoc.data();
      
      console.log(`Checking grades for course ${courseId}`);
      
      // Check if student roll number exists in this course's grades
      if (gradesData && gradesData[rollNo]) {
        const studentGrades = gradesData[rollNo];
        console.log(`Found grades for roll ${rollNo} in course ${courseId}:`, studentGrades);
        
        // Create a notification for these grades
        const quizAvg = calculateAverage(studentGrades.quiz || []);
        const assignmentAvg = calculateAverage(studentGrades.assignment || []);
        
        // Create a unique ID for this notification
        const notificationId = `direct-grades-${courseId}-${Date.now()}`;
        
        // Skip if this notification ID was removed before
        if (removedNotifications.includes(notificationId)) {
          console.log(`Skipping previously removed notification for course ${courseId}`);
          continue;
        }
        
        // Try to use the last update timestamp from the grade data, if available
        let notificationDate;
        if (gradesData.lastUpdated) {
          if (typeof gradesData.lastUpdated.toDate === 'function') {
            notificationDate = gradesData.lastUpdated.toDate();
          } else {
            notificationDate = new Date(gradesData.lastUpdated);
          }
        } else {
          // If no timestamp is available, use current time
          notificationDate = new Date();
        }
        
        // Create a notification with default values since we don't have exact update info
        const notificationData = {
          id: notificationId,
          date: notificationDate,
          title: `Grades available for ${courseId}`,
          message: `You have grades recorded for course ${courseId}`,
          type: 'grade',
          courseId: courseId,
          read: false,
          teacherName: 'Instructor',
          details: {
            quizzes: studentGrades.quiz || [],
            assignments: studentGrades.assignment || [],
            midterm: studentGrades.mid || 0,
            final: studentGrades.final || 0,
            quizAvg: quizAvg,
            assignmentAvg: assignmentAvg,
            courseName: courseId,
            component: 'Grades'
          },
          isAlert: false,
          isDirectCheck: true // Flag to indicate this was from direct grades check
        };
        
        // Only add this notification if there isn't already one for this course
        const existingNotification = notifications.find(n => 
          n.type === 'grade' && n.courseId === courseId && !n.isDirectCheck
        );
        
        if (!existingNotification) {
          console.log(`Adding direct grade notification for course ${courseId}`);
          notifications.push(notificationData);
          notificationsAdded = true;
        } else {
          console.log(`Skipping direct grade notification for course ${courseId} as one already exists`);
        }
      } else {
        console.log(`No grades found for roll ${rollNo} in course ${courseId}`);
      }
    }
    
    if (notificationsAdded) {
      console.log('Added direct grade notifications, will sort them later');
    }
  } catch (error) {
    console.error('Error checking grades directly:', error);
  }
};

// Function to create a notification when grades are updated
export const createGradeNotification = async (studentId, courseId, teacherName, grades, prevGrades = null) => {
  try {
    const notificationsRef = collection(db, "notifications");
    
    // Prepare notification data
    const notificationData = {
      studentId: studentId,
      date: new Date(),
      title: prevGrades ? "Grades Modified" : "Grades Added",
      message: prevGrades
        ? `Your grades have been modified by ${teacherName} for course ${courseId}`
        : `New grades have been added by ${teacherName} for course ${courseId}`,
      type: 'grade',
      courseId: courseId,
      read: false,
      teacherName: teacherName,
      details: {
        grades: grades,
        previousGrades: prevGrades
      }
    };
    
    await addDoc(notificationsRef, notificationData);
    
  } catch (error) {
    console.error('Error creating grade notification:', error);
  }
};

// Function to create a notification when attendance is updated
export const createAttendanceNotification = async (studentId, courseId, teacherName, status, date, prevStatus = null) => {
  try {
    const notificationsRef = collection(db, "notifications");
    
    // Prepare notification data
    const notificationData = {
      studentId: studentId,
      date: new Date(),
      title: prevStatus ? "Attendance Modified" : "Attendance Recorded",
      message: prevStatus
        ? `Your attendance has been changed from ${prevStatus ? 'present' : 'absent'} to ${status ? 'present' : 'absent'} by ${teacherName}`
        : `Your attendance has been marked as ${status ? 'present' : 'absent'} by ${teacherName}`,
      type: 'attendance',
      courseId: courseId,
      read: false,
      teacherName: teacherName,
      details: {
        status: status,
        date: date,
        previousStatus: prevStatus
      }
    };
    
    await addDoc(notificationsRef, notificationData);
    
  } catch (error) {
    console.error('Error creating attendance notification:', error);
  }
};

// Update the checkIfLogIsRelevantToStudent function to catch all attendance action types
const checkIfLogIsRelevantToStudent = (logData, rollNo) => {
  try {
    // Check for attendance logs with expanded action type detection
    if (logData.action === "attendance" || 
        logData.action === "attendence" || 
        logData.action === "mark_attendance" || 
        logData.action === "mark_attendence" || 
        logData.actionType === "attendance" ||
        logData.type === "attendance" ||
        (logData.action && logData.action.toLowerCase().includes('attend'))) {
      
      let studentData = null;
      
      // Check if data is a string that needs parsing
      if (typeof logData.data === 'string' && logData.data.trim() !== '') {
        try {
          const parsedData = JSON.parse(logData.data);
          if (parsedData && parsedData[rollNo]) {
            return true;
          }
        } catch (e) {
          console.error('Error parsing log data:', e);
        }
      } else if (logData.data && logData.data[rollNo]) {
        // Data is already an object
        return true;
      } else if (logData[rollNo]) {
        // Try direct access for older logs
        return true;
      }
    }
    
    // Check for grade logs - keep existing code
    if (logData.action === "grading") {
      let studentGrades = null;
      
      // Check if data is a string that needs parsing
      if (typeof logData.data === 'string' && logData.data.trim() !== '') {
        try {
          const parsedData = JSON.parse(logData.data);
          if (parsedData && parsedData[rollNo]) {
            return true;
          }
        } catch (e) {
          console.error('Error parsing grade data:', e);
        }
      } else if (logData.data && logData.data[rollNo]) {
        // Data is already an object
        return true;
      }
    }
  } catch (error) {
    console.error('Error checking if log is relevant:', error);
  }
  
  return false;
}; 