// Firebase Notifications System Setup Guide

/*
STEP 1: Create a 'notifications' collection in Firebase if it doesn't exist already
- This collection will store all notifications for all students
- Each document represents a single notification

STEP 2: Notification Document Structure
{
  id: "auto-generated",
  studentId: "student-id",      // The specific student this notification is for
  timestamp: Timestamp,         // Firebase server timestamp for proper ordering
  type: "attendance"|"grade",   // Type of notification
  read: false,                  // Whether notification has been read
  courseId: "course-id",        // Related course
  title: "Notification title",  // Human-readable title
  message: "Notification text", // Detailed message
  data: {                       // Additional data specific to notification type
    // For attendance notifications:
    status: "present"|"absent",
    date: "YYYY-MM-DD",
    
    // For grade notifications:
    component: "quiz"|"assignment"|"midterm"|"final",
    value: 85, // The actual grade value
    previousValue: 80, // Optional, for updates
  }
}

STEP 3: Security Rules for the Collection
// Add these rules to your Firebase security rules

match /notifications/{notificationId} {
  // Only allow read access if the notification is for the authenticated user
  allow read: if request.auth != null && 
              resource.data.studentId == request.auth.uid;
              
  // Allow creation from admin users or your application server
  allow create: if request.auth != null && 
                (request.auth.token.admin == true || 
                 request.resource.data.studentId == request.auth.uid);
                 
  // Allow updates only to the read status by the student
  allow update: if request.auth != null && 
                resource.data.studentId == request.auth.uid &&
                request.resource.data.diff(resource.data).affectedKeys().hasOnly(['read']);
}

STEP 4: Example of Creating a Notification in Attendance Marking
// Import required Firebase modules
import { db, Timestamp } from './firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// Create a notification when attendance is marked
async function createAttendanceNotification(studentId, courseId, status, date, courseName) {
  try {
    const notificationsRef = collection(db, "notifications");
    
    // Format a nice title and message
    const title = `Attendance Marked: ${courseName}`;
    const message = `Your attendance has been marked as ${status} for ${courseName} on ${date}.`;
    
    // Create the notification document
    await addDoc(notificationsRef, {
      studentId,
      timestamp: Timestamp.now(),
      type: "attendance",
      read: false,
      courseId,
      title,
      message,
      data: {
        status,
        date,
        courseName
      }
    });
    
    console.log("Attendance notification created successfully");
  } catch (error) {
    console.error("Error creating attendance notification:", error);
  }
}

STEP 5: Example of Creating a Notification in Grade Updates
// Create a notification when a grade is updated
async function createGradeNotification(studentId, courseId, component, value, previousValue, courseName) {
  try {
    const notificationsRef = collection(db, "notifications");
    
    // Format a nice title and message
    const title = `Grade Updated: ${component} for ${courseName}`;
    
    let message;
    if (previousValue) {
      message = `Your ${component} grade has been updated from ${previousValue} to ${value} in ${courseName}.`;
    } else {
      message = `Your ${component} grade of ${value} has been recorded in ${courseName}.`;
    }
    
    // Create the notification document
    await addDoc(notificationsRef, {
      studentId,
      timestamp: Timestamp.now(),
      type: "grade",
      read: false,
      courseId,
      title,
      message,
      data: {
        component,
        value,
        previousValue,
        courseName
      }
    });
    
    console.log("Grade notification created successfully");
  } catch (error) {
    console.error("Error creating grade notification:", error);
  }
}
*/

// This file serves as documentation for setting up the notifications system
// See above for the complete implementation guide
console.log("Firebase Notifications System Setup Guide loaded"); 