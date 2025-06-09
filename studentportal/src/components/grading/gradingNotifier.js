// Grading Notification Integration
import { createGradeNotification } from '../../utils/notificationHelpers';

/**
 * Sends grade notifications to a student when their grades are updated
 * @param {string} studentId - The ID of the student
 * @param {string} courseId - The ID of the course
 * @param {string} component - Type of grade component (quiz, assignment, midterm, final)
 * @param {number|array} newValue - The new grade value(s)
 * @param {number|array} previousValue - The previous grade value(s), if any
 * @param {string} courseName - The name of the course
 * @param {string} teacherName - The name of the teacher updating grades
 * @returns {Promise<boolean>} - Whether the notification was sent successfully
 */
export const sendGradeNotification = async (
  studentId, 
  courseId, 
  component, 
  newValue, 
  previousValue = undefined, 
  courseName, 
  teacherName
) => {
  try {
    return await createGradeNotification(
      studentId,
      courseId,
      component,
      newValue,
      previousValue,
      courseName,
      teacherName
    );
  } catch (error) {
    console.error(`Error sending grade notification to student ${studentId}:`, error);
    return false;
  }
};

/**
 * Sends batch grade notifications to multiple students
 * @param {Object} gradesData - Map of studentId to grade data
 * @param {string} courseId - The ID of the course
 * @param {string} component - Type of grade component (quiz, assignment, midterm, final)
 * @param {string} courseName - The name of the course
 * @param {string} teacherName - The name of the teacher updating grades
 * @returns {Promise<boolean>} - Whether all notifications were sent successfully
 */
export const sendBatchGradeNotifications = async (
  gradesData, 
  courseId, 
  component, 
  courseName, 
  teacherName
) => {
  // Track success/failure for each notification
  const results = [];
  
  try {
    // Iterate through each student in the grades data
    for (const [studentId, gradeInfo] of Object.entries(gradesData)) {
      if (studentId === 'timestamp' || studentId === 'teacherId') continue;
      
      try {
        // Extract the new grade value and previous value if available
        const { value, previousValue } = extractGradeValues(gradeInfo, component);
        
        // Send notification for this student
        const result = await createGradeNotification(
          studentId,
          courseId,
          component,
          value,
          previousValue,
          courseName,
          teacherName
        );
        
        results.push(result);
      } catch (error) {
        console.error(`Error sending grade notification to student ${studentId}:`, error);
        results.push(false);
      }
    }
    
    // Return overall success status
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error sending batch grade notifications:', error);
    return false;
  }
};

/**
 * Helper function to extract grade values from various data structures
 */
const extractGradeValues = (gradeInfo, component) => {
  // Default values
  let value = null;
  let previousValue = undefined;
  
  if (!gradeInfo) return { value, previousValue };
  
  // Handle different data structures based on component type
  const componentLower = component.toLowerCase();
  
  if (componentLower === 'quiz') {
    value = gradeInfo.quizzes || gradeInfo.quizzes || [];
    previousValue = gradeInfo.previousGrades?.quizzes;
  } 
  else if (componentLower === 'assignment') {
    value = gradeInfo.assignments || gradeInfo.assignmentDetails || [];
    previousValue = gradeInfo.previousGrades?.assignments;
  }
  else if (componentLower === 'midterm') {
    value = gradeInfo.midterm || 0;
    previousValue = gradeInfo.previousGrades?.midterm;
  }
  else if (componentLower === 'final') {
    value = gradeInfo.final || 0;
    previousValue = gradeInfo.previousGrades?.final;
  }
  else if (componentLower === 'all' || componentLower === 'grades') {
    // For general grade updates
    value = {
      quizzes: gradeInfo.quizzes || [],
      assignments: gradeInfo.assignments || [],
      midterm: gradeInfo.midterm || 0,
      final: gradeInfo.final || 0
    };
    
    if (gradeInfo.previousGrades) {
      previousValue = gradeInfo.previousGrades;
    }
  }
  
  return { value, previousValue };
};

/**
 * Integrate this with your grading component
 * 
 * Example usage in grading component:
 * 
 * import { sendGradeNotification, sendBatchGradeNotifications } from './gradingNotifier';
 * 
 * // For updating a single student's grade:
 * const notificationSuccess = await sendGradeNotification(
 *   studentId,
 *   courseId,
 *   'quiz', // or 'assignment', 'midterm', 'final'
 *   85, // new value
 *   80, // previous value (optional)
 *   courseName,
 *   teacherName
 * );
 * 
 * // For batch updating multiple students:
 * const batchSuccess = await sendBatchGradeNotifications(
 *   gradesData, // mapping of studentId to grade data
 *   courseId,
 *   'quiz',
 *   courseName,
 *   teacherName
 * );
 */

export default {
  sendGradeNotification,
  sendBatchGradeNotifications
}; 