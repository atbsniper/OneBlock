// Notification Helper Functions for Attendance and Grading
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs, query, where, orderBy, updateDoc } from 'firebase/firestore';

/**
 * Fetches all notifications for a student
 * @param {string} studentId - The ID of the student
 * @returns {Array} - Array of notification objects
 */
export const getStudentNotifications = async (studentId) => {
  try {
    if (!studentId) {
      console.error("Student ID is missing in getStudentNotifications");
      throw new Error("Student ID is required");
    }
    
    console.log(`Creating Firestore query for notifications with studentId = "${studentId}"`);
    
    const notificationsRef = collection(db, "notifications");
    
    // Create a normal query with the provided studentId
    const notificationsQuery = query(
      notificationsRef,
      where("studentId", "==", studentId),
      orderBy("timestamp", "desc") // Most recent first
    );
    
    console.log("Executing Firestore query for notifications with primary ID");
    const querySnapshot = await getDocs(notificationsQuery);
    console.log(`Primary query returned ${querySnapshot.size} notifications`);
    
    let notifications = [];
    
    // Process results from the first query
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`Processing notification document ID: ${doc.id}`, data);
      
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
    
    // If no results, try alternative ID formats
    if (notifications.length === 0) {
      console.log("No notifications found with primary ID, trying alternatives");
      
      // Create an array of possible alternative IDs
      const alternativeIds = [
        studentId.toString(),                   // Convert to string
        studentId.toLowerCase(),                // Try lowercase
        studentId.toUpperCase(),                // Try uppercase
        studentId.trim(),                       // Remove whitespace
        parseInt(studentId, 10).toString()      // If it's a numeric string
      ];
      
      // If the ID might be a Firebase auto ID vs custom ID
      if (studentId.length > 10) {
        // If we have a long ID that might be a Firebase auto ID or custom ID
        // Try getting just the last part which might be a roll number
        const rollPart = studentId.split('-').pop();
        alternativeIds.push(rollPart);
      } 
      
      console.log("Trying alternative IDs:", alternativeIds);
      
      // Try each alternative ID
      for (const altId of alternativeIds) {
        if (altId === studentId) continue; // Skip if same as original
        
        console.log(`Trying alternative studentId = "${altId}"`);
        const altQuery = query(
          notificationsRef,
          where("studentId", "==", altId)
        );
        
        const altSnapshot = await getDocs(altQuery);
        console.log(`Alternative query returned ${altSnapshot.size} notifications`);
        
        if (altSnapshot.size > 0) {
          // Process results from this alternative query
          altSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`Processing alternative notification document ID: ${doc.id}`, data);
            
            // Normalize the timestamp as before
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
              timestamp: notificationDate.getTime(),
              fromAlternativeId: true  // Mark this came from alternative ID
            });
          });
          
          console.log(`Found ${altSnapshot.size} notifications with alternative ID ${altId}`);
        }
      }
    }
    
    console.log(`Total notifications found: ${notifications.length}`);
    
    // Sort by timestamp desc (just to be sure)
    notifications.sort((a, b) => b.timestamp - a.timestamp);
    
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};

// Add this new function to standardize notification student IDs
export const fixNotificationStudentIds = async () => {
  try {
    console.log("Starting the notification student ID fix process...");
    
    // 1. First, fetch all students to create a mapping
    const studentsRef = collection(db, "students");
    const studentsSnapshot = await getDocs(studentsRef);
    
    // Create mappings between different ID types
    const rollNumberToFirebaseId = {};
    const firebaseIdToRollNumber = {};
    
    studentsSnapshot.forEach(doc => {
      const studentData = doc.data();
      if (studentData.rollNo) {
        rollNumberToFirebaseId[studentData.rollNo] = doc.id;
        firebaseIdToRollNumber[doc.id] = studentData.rollNo;
      }
    });
    
    console.log("Created student ID mappings:", {
      rollNumberToFirebaseId,
      firebaseIdToRollNumber
    });
    
    // 2. Fetch all notifications
    const notificationsRef = collection(db, "notifications");
    const notificationsSnapshot = await getDocs(notificationsRef);
    
    // Count statistics
    let updatedCount = 0;
    let alreadyCorrectCount = 0;
    let errorCount = 0;
    
    // 3. Process each notification
    for (const doc of notificationsSnapshot.docs) {
      try {
        const notificationData = doc.data();
        const currentStudentId = notificationData.studentId;
        
        // If it looks like a roll number (contains a hyphen)
        if (currentStudentId && currentStudentId.includes('-')) {
          // Should be updated to Firebase ID
          if (rollNumberToFirebaseId[currentStudentId]) {
            const firebaseId = rollNumberToFirebaseId[currentStudentId];
            console.log(`Converting roll number ${currentStudentId} to Firebase ID ${firebaseId} for notification ${doc.id}`);
            
            // Update the notification
            await updateDoc(doc.ref, {
              studentId: firebaseId
            });
            
            updatedCount++;
          } else {
            console.warn(`Could not find Firebase ID for roll number ${currentStudentId} for notification ${doc.id}`);
            errorCount++;
          }
        } 
        // Skip notifications that already use Firebase IDs
        else {
          alreadyCorrectCount++;
        }
      } catch (error) {
        console.error(`Error processing notification ${doc.id}:`, error);
        errorCount++;
      }
    }
    
    console.log("Notification ID fix completed:", {
      updatedCount,
      alreadyCorrectCount,
      errorCount,
      totalProcessed: updatedCount + alreadyCorrectCount + errorCount
    });
    
    return {
      success: true,
      updatedCount,
      alreadyCorrectCount,
      errorCount
    };
  } catch (error) {
    console.error("Error in fixNotificationStudentIds:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default {
  getStudentNotifications,
  fixNotificationStudentIds
}; 