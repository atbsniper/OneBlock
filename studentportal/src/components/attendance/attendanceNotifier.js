// Attendance Notification Integration
import { createAttendanceNotification } from '../../utils/notificationHelpers';

/**
 * Sends attendance notifications to students when their attendance is marked
 * @param {Object} attendanceData - The attendance data being submitted
 * @param {string} courseId - The ID of the course
 * @param {string} courseName - The name of the course
 * @param {string} teacherName - The name of the teacher marking attendance
 * @param {string} date - The date of attendance (YYYY-MM-DD format)
 * @returns {Promise<boolean>} - Whether all notifications were sent successfully
 */
export const sendAttendanceNotifications = async (attendanceData, courseId, courseName, teacherName, date) => {
  // Track success/failure for each notification
  const results = [];
  
  try {
    // Extract date from parameters or use current date
    const attendanceDate = date || new Date().toISOString().split('T')[0];
    
    // Iterate through each student in the attendance data
    for (const [studentId, status] of Object.entries(attendanceData)) {
      if (studentId === 'timestamp' || studentId === 'date' || studentId === 'teacherId') continue;
      
      try {
        // Send notification for this student
        const result = await createAttendanceNotification(
          studentId,
          courseId,
          status, // 'present' or 'absent'
          attendanceDate,
          courseName,
          teacherName
        );
        
        results.push(result);
      } catch (error) {
        console.error(`Error sending attendance notification to student ${studentId}:`, error);
        results.push(false);
      }
    }
    
    // Return overall success status
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error sending attendance notifications:', error);
    return false;
  }
};

/**
 * Integrate this with your attendance marking component
 * 
 * Example usage in attendance component:
 * 
 * import { sendAttendanceNotifications } from './attendanceNotifier';
 * 
 * // After successfully marking attendance in your component:
 * const notificationSuccess = await sendAttendanceNotifications(
 *   attendanceData,
 *   courseId,
 *   courseName,
 *   teacherName,
 *   date
 * );
 * 
 * if (notificationSuccess) {
 *   console.log("Attendance notifications sent successfully");
 * } else {
 *   console.error("Some attendance notifications failed to send");
 * }
 */

export default {
  sendAttendanceNotifications
}; 