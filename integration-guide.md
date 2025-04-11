# Notifications Integration Guide

This guide explains how to integrate the new notification system with your existing attendance and grading components.

## Firebase Setup

1. You already have the `notifications` collection created in your Firebase project
2. Each notification document has the structure:
   ```
   {
     id: "auto-generated",
     studentId: "student-id",      // The specific student this notification is for
     timestamp: Timestamp,         // Firebase server timestamp for proper ordering
     type: "attendance"|"grade",   // Type of notification
     read: false,                  // Whether notification has been read
     courseId: "course-id",        // Related course
     title: "Notification title",  // Human-readable title
     message: "Notification text", // Detailed message
     details: { ... }              // Additional data specific to notification type
   }
   ```

## Integration with Attendance Component

Add the following code to your attendance marking component:

1. Import the notification helper:
   ```javascript
   import { sendAttendanceNotifications } from './attendanceNotifier';
   ```

2. Call the function after successfully marking attendance:
   ```javascript
   // Inside your attendance submit handler:
   
   // After successfully updating the attendance in Firebase:
   try {
     // Assuming attendanceData is your object with student attendance
     const notificationSuccess = await sendAttendanceNotifications(
       attendanceData,       // Object with studentId keys and "present"/"absent" values
       courseId,             // The course ID
       courseName,           // The course name
       teacher.name || "Instructor", // The teacher marking attendance
       selectedDate          // Date in YYYY-MM-DD format
     );
     
     if (notificationSuccess) {
       console.log("Attendance notifications sent successfully");
     } else {
       console.error("Some attendance notifications failed to send");
     }
   } catch (error) {
     console.error("Error sending attendance notifications:", error);
   }
   ```

## Integration with Grading Component

Add the following code to your grading component:

1. Import the notification helper:
   ```javascript
   import { sendGradeNotification, sendBatchGradeNotifications } from './gradingNotifier';
   ```

2. For updating a single student's grade:
   ```javascript
   // Inside your grade update handler:
   
   // After successfully updating the grade in Firebase:
   try {
     const notificationSuccess = await sendGradeNotification(
       studentId,            // The student ID
       courseId,             // The course ID
       'quiz',               // Component type: 'quiz', 'assignment', 'midterm', 'final'
       85,                   // New grade value (can be array for quizzes/assignments)
       80,                   // Previous value (optional)
       courseName,           // The course name
       teacher.name || "Instructor" // The teacher updating grades
     );
     
     if (notificationSuccess) {
       console.log("Grade notification sent successfully");
     } else {
       console.error("Failed to send grade notification");
     }
   } catch (error) {
     console.error("Error sending grade notification:", error);
   }
   ```

3. For batch updating multiple students' grades:
   ```javascript
   // Inside your batch grade update handler:
   
   // After successfully updating grades in Firebase:
   try {
     // Assuming gradesData is your object with student grades
     const batchSuccess = await sendBatchGradeNotifications(
       gradesData,           // Object with studentId keys and grade data values
       courseId,             // The course ID
       'quiz',               // Component type: 'quiz', 'assignment', 'midterm', 'final'
       courseName,           // The course name
       teacher.name || "Instructor" // The teacher updating grades
     );
     
     if (batchSuccess) {
       console.log("Batch grade notifications sent successfully");
     } else {
       console.error("Some grade notifications failed to send");
     }
   } catch (error) {
     console.error("Error sending batch grade notifications:", error);
   }
   ```

## Example Integration in Your Attendance Component

In your `studentportal/src/components/attendance/attendence.jsx` file, find the function that marks attendance and add the notification code:

```javascript
// Import at the top of the file:
import { sendAttendanceNotifications } from './attendanceNotifier';

// Inside your markAttendance function or similar:
const markAttendance = async () => {
  try {
    // Your existing code to mark attendance...
    
    // After successfully updating the attendance in Firebase:
    await sendAttendanceNotifications(
      attendanceData,
      courseId,
      course.name || "Course",
      teacherData.name || "Instructor",
      selectedDate
    );
    
    toast.success("Attendance marked and notifications sent");
  } catch (error) {
    console.error("Error marking attendance:", error);
    toast.error("Failed to mark attendance");
  }
};
```

## Example Integration in Your Grading Component

In your `studentportal/src/components/grading/grading.jsx` file, find the function that updates grades and add the notification code:

```javascript
// Import at the top of the file:
import { sendGradeNotification, sendBatchGradeNotifications } from './gradingNotifier';

// Inside your updateGrade function or similar:
const updateGrade = async (studentId, component, value) => {
  try {
    // Your existing code to update grade...
    
    // After successfully updating the grade in Firebase:
    await sendGradeNotification(
      studentId,
      courseId,
      component,
      value,
      previousValue, // If available
      course.name || "Course",
      teacherData.name || "Instructor"
    );
    
    toast.success("Grade updated and notification sent");
  } catch (error) {
    console.error("Error updating grade:", error);
    toast.error("Failed to update grade");
  }
};
```

## Testing the Integration

1. After integrating, test by:
   - Marking a student as present/absent in a course
   - Updating a grade for a student
   - Login as that student and check their notifications page

2. The notifications should appear immediately and be sorted by most recent first.

3. You can also verify the notifications were created by checking your Firebase console.

## Troubleshooting

If notifications aren't appearing:

1. Check the browser console for errors
2. Verify the student ID is correct in both components
3. Make sure you're logged in as the same student in the student view
4. Check that the timestamp is being set correctly
5. Verify the Firebase security rules allow creating notifications 