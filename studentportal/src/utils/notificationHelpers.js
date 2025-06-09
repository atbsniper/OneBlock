// Notification Helper Functions for Attendance and Grading
import { db } from '../firebase/firebaseConfig';
import { collection, addDoc, Timestamp, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';

/**
 * Helper function to ensure consistent student ID usage
 * @param {string} studentId - The student ID (could be roll number or Firebase ID)
 * @returns {Promise<string>} - The standardized Firebase document ID for the student
 */
const ensureConsistentStudentId = async (studentId) => {
  // If it looks like a roll number (contains a hyphen), convert to Firebase ID
  if (studentId && studentId.includes('-')) {
    try {
      // Query students collection to find the matching Firebase ID
      const studentsRef = collection(db, "students");
      const studentQuery = query(
        studentsRef,
        where("rollNo", "==", studentId)
      );
      
      const studentSnapshot = await getDocs(studentQuery);
      
      if (!studentSnapshot.empty) {
        // Found a matching student document, use its ID
        return studentSnapshot.docs[0].id;
      } else {
        console.warn(`No student found with roll number ${studentId}, using original ID`);
        return studentId;
      }
    } catch (error) {
      console.error(`Error converting roll number to Firebase ID: ${error}`);
      return studentId;
    }
  }
  
  // Already a Firebase ID or unable to convert
  return studentId;
};

/**
 * Creates a notification when attendance is marked for a student
 * @param {string} studentId - The ID of the student
 * @param {string} courseId - The ID of the course
 * @param {string} status - "present" or "absent"
 * @param {string} date - Date of attendance in YYYY-MM-DD format
 * @param {string} courseName - Name of the course
 * @param {string} teacherName - Name of the teacher marking attendance
 */
export const createAttendanceNotification = async (studentId, courseId, status, date, courseName, teacherName = "Instructor") => {
  try {
    // Ensure we use a consistent student ID format
    const standardizedStudentId = await ensureConsistentStudentId(studentId);
    
    const notificationsRef = collection(db, "notifications");
    
    // Format a nice title and message
    const title = `Attendance Marked: ${courseName}`;
    const message = `Your attendance has been marked as ${status} for ${courseName} on ${date}.`;
    
    // Format date for display
    const displayDate = new Date(date).toLocaleDateString();
    const dayOfWeek = new Date(date).toLocaleDateString(undefined, { weekday: 'long' });
    
    // Create the notification document
    await addDoc(notificationsRef, {
      studentId: standardizedStudentId,
      timestamp: Timestamp.now(),
      type: "attendance",
      read: false,
      courseId,
      title,
      message,
      teacherName,
      details: {
        status,
        date,
        courseName,
        day: dayOfWeek
      }
    });
    
    console.log(`Attendance notification created for student ${standardizedStudentId} in course ${courseId}`);
    return true;
  } catch (error) {
    console.error("Error creating attendance notification:", error);
    return false;
  }
};

/**
 * Creates a notification when a grade is updated for a student
 * @param {string} studentId - The ID of the student
 * @param {string} courseId - The ID of the course
 * @param {string} component - "quiz", "assignment", "midterm", "final"
 * @param {number|array} value - The grade value or array of values
 * @param {number|array} previousValue - The previous grade value or array of values (optional)
 * @param {string} courseName - Name of the course
 * @param {string} teacherName - Name of the teacher updating the grade
 */
export const createGradeNotification = async (studentId, courseId, component, value, previousValue, courseName, teacherName = "Instructor") => {
  try {
    // Ensure we use a consistent student ID format
    const standardizedStudentId = await ensureConsistentStudentId(studentId);
    
    const notificationsRef = collection(db, "notifications");
    
    // Format a nice title and message
    const title = `Grade Updated: ${component} for ${courseName}`;
    
    let message;
    if (previousValue !== undefined) {
      message = `Your ${component} grade has been updated in ${courseName}.`;
    } else {
      message = `Your ${component} grade has been recorded in ${courseName}.`;
    }
    
    // Prepare details object based on component type
    let details = {
      courseName,
      component
    };
    
    // For different types of components, structure the data differently
    if (component.toLowerCase() === "quiz") {
      details.quizzes = Array.isArray(value) ? value : [value];
      details.quizAvg = Array.isArray(value) ? 
        value.reduce((sum, val) => sum + (Number(val) || 0), 0) / value.length : 
        value;
      
      if (previousValue) {
        details.previousGrades = {
          quizzes: Array.isArray(previousValue) ? previousValue : [previousValue],
          quizAvg: Array.isArray(previousValue) ? 
            previousValue.reduce((sum, val) => sum + (Number(val) || 0), 0) / previousValue.length : 
            previousValue
        };
      }
    } 
    else if (component.toLowerCase() === "assignment") {
      details.assignments = Array.isArray(value) ? value : [value];
      details.assignmentAvg = Array.isArray(value) ? 
        value.reduce((sum, val) => sum + (Number(val) || 0), 0) / value.length : 
        value;
      
      if (previousValue) {
        details.previousGrades = {
          assignments: Array.isArray(previousValue) ? previousValue : [previousValue],
          assignmentAvg: Array.isArray(previousValue) ? 
            previousValue.reduce((sum, val) => sum + (Number(val) || 0), 0) / previousValue.length : 
            previousValue
        };
      }
    }
    else if (component.toLowerCase() === "midterm") {
      details.midterm = value;
      
      if (previousValue) {
        details.previousGrades = { midterm: previousValue };
      }
    }
    else if (component.toLowerCase() === "final") {
      details.final = value;
      
      if (previousValue) {
        details.previousGrades = { final: previousValue };
      }
    }
    else {
      // General grade update (all components)
      if (typeof value === 'object') {
        details = { ...details, ...value };
        
        if (previousValue && typeof previousValue === 'object') {
          details.previousGrades = previousValue;
        }
      }
    }
    
    // Create the notification document
    await addDoc(notificationsRef, {
      studentId: standardizedStudentId,
      timestamp: Timestamp.now(),
      type: "grade",
      read: false,
      courseId,
      title,
      message,
      teacherName,
      details
    });
    
    console.log(`Grade notification created for student ${standardizedStudentId} in course ${courseId}`);
    return true;
  } catch (error) {
    console.error("Error creating grade notification:", error);
    return false;
  }
};

/**
 * Fetches all notifications for a student
 * @param {string} studentId - The ID of the student
 * @returns {Array} - Array of notification objects
 */
export const getStudentNotifications = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error("Student ID is required");
    }
    
    const notificationsRef = collection(db, "notifications");
    const notificationsQuery = query(
      notificationsRef,
      where("studentId", "==", studentId),
      orderBy("timestamp", "desc") // Most recent first
    );
    
    const querySnapshot = await getDocs(notificationsQuery);
    
    const notifications = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Normalize the timestamp for easier use
      let notificationDate;
      if (data.timestamp && typeof data.timestamp.toDate === 'function') {
        notificationDate = data.timestamp.toDate();
      } else if (data.timestamp) {
        notificationDate = new Date(data.timestamp);
      } else {
        notificationDate = new Date();
      }
      
      notifications.push({
        id: doc.id,
        ...data,
        date: notificationDate,
        timestamp: notificationDate.getTime() // For reliable sorting
      });
    });
    
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

export default {
  createAttendanceNotification,
  createGradeNotification,
  getStudentNotifications
}; 