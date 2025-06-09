import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullhorn, 
  faArrowLeft, 
  faCalendarAlt, 
  faBookOpen,
  faChevronDown,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { db, getStudentCourses } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Announcements.css';

const Announcements = () => {
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Function to fetch courses from multiple collections
  const fetchCourses = async (studentId) => {
    try {
      // First try to get courses using the existing function
      let studentCourses = await getStudentCourses(studentId);
      
      // Additionally, fetch course information from announcements collection
      const announcementsRef = collection(db, "announcements");
      const announcementsQuery = query(announcementsRef);
      const announcementsSnapshot = await getDocs(announcementsQuery);
      
      // Extract unique course information from announcements
      const courseIdsFromAnnouncements = new Set();
      const coursesFromAnnouncements = [];
      
      announcementsSnapshot.forEach((doc) => {
        const data = doc.data();
        // Check for courseID (capital ID as in debug info) and courseName
        if (data.courseID && !courseIdsFromAnnouncements.has(data.courseID)) {
          courseIdsFromAnnouncements.add(data.courseID);
          coursesFromAnnouncements.push({
            id: data.courseID,
            courseName: data.courseName || `Course ${data.courseID}`,
            // Include other properties if available
            teacherName: data.teacherName
          });
        }
      });
      
      // Combine courses from both sources, prioritizing announcements data
      const combinedCourses = [...studentCourses];
      
      coursesFromAnnouncements.forEach(courseFromAnnouncements => {
        const existingCourseIndex = combinedCourses.findIndex(course => course.id === courseFromAnnouncements.id);
        
        if (existingCourseIndex !== -1) {
          // Update existing course with more information
          combinedCourses[existingCourseIndex] = {
            ...combinedCourses[existingCourseIndex],
            ...courseFromAnnouncements
          };
        } else {
          // Add new course
          combinedCourses.push(courseFromAnnouncements);
        }
      });
      
      if (combinedCourses && combinedCourses.length > 0) {
        setCourses(combinedCourses);
        return combinedCourses;
      } else {
        setCourses([]);
        return [];
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Failed to load courses");
      setCourses([]);
      return [];
    }
  };

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
        setStudentData(parsedStudentData);
        
        // Fetch courses for this student using the separate function
        const studentCourses = await fetchCourses(parsedStudentData.id);
        
        // Only fetch announcements after courses are loaded
        if (studentCourses && studentCourses.length > 0) {
          await fetchAnnouncements(parsedStudentData.id, 'all', studentCourses);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading data: ' + error.message);
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, []);

  // Process the announcement data to ensure consistency
  const processAnnouncement = (data, docId) => {
    try {
      // Create a consistent announcement object based on the data structure
      return {
        id: docId,
        title: data.title || `Announcement from ${data.courseName || data.courseID || 'Unknown Course'}`,
        content: data.message || data.content || 'No content available',
        courseId: data.courseID || data.courseId || 'Unknown course',
        courseName: data.courseName || getCourseName(data.courseID || data.courseId) || 'Unknown Course',
        timestamp: data.timestamp?.toDate ? data.timestamp.toDate() : 
                   data.timestampString ? new Date(data.timestampString) : new Date(),
        authorName: data.teacherName || data.authorName || 'Unknown author',
        attachments: data.attachments || []
      };
    } catch (error) {
      console.error("Error processing announcement:", error);
      // Return a minimal valid announcement if processing fails
      return {
        id: docId,
        title: "Error Processing Announcement",
        content: "There was an error processing this announcement data.",
        courseId: "unknown",
        courseName: "Unknown Course",
        timestamp: new Date(),
        authorName: "System"
      };
    }
  };

  const fetchAnnouncements = async (studentId, courseId, studentCourses = courses) => {
    setLoading(true);
    try {
      // Use the passed courses or the state value
      const enrolledCourses = studentCourses.map(course => course.id);
      
      const announcementsRef = collection(db, "announcements");
      let announcementsQuery;
      
      if (courseId === 'all') {
        // Fetch announcements for all courses
        announcementsQuery = query(
          announcementsRef,
          orderBy("timestamp", "desc")
        );
      } else {
        // Fetch announcements for specific course
        announcementsQuery = query(
          announcementsRef,
          where("courseID", "==", courseId), // Note: using courseID instead of courseId based on the debug info
          orderBy("timestamp", "desc")
        );
      }
      
      const querySnapshot = await getDocs(announcementsQuery);
      const announcementsData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Use the processAnnouncement helper function
        const announcement = processAnnouncement(data, doc.id);
        announcementsData.push(announcement);
      });
      
      setAnnouncements(announcementsData);
      setFilteredAnnouncements(announcementsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Error loading announcements: ' + error.message);
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourse(courseId);
    if (courseId === 'all') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter(announcement => announcement.courseId === courseId);
      setFilteredAnnouncements(filtered);
    }
    setDropdownOpen(false);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return new Date(date).toLocaleDateString(undefined, options);
  };

  const getCourseName = (courseId) => {
    if (!courseId) return 'Unknown Course';
    
    // Find the course in our list of courses
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
      // Try different possible properties for the course name
      return course.courseName || course.name || course.title || `Course ${courseId}`;
    }
    
    // If course not found in our list, just return the ID
    return courseId;
  };

  // If studentData is null, we haven't initialized yet
  if (!studentData && loading) {
    return (
      <div className="announcements-container">
        <h1>Announcements</h1>
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading student data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="announcements-container">
      <h1>Announcements</h1>
      
      {/* Course selection dropdown */}
      <div className="course-selector">
        <div className="dropdown">
          <button 
            className="dropdown-toggle" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            disabled={loading}
          >
            {selectedCourse === 'all' 
              ? 'All Courses' 
              : `Course: ${getCourseName(selectedCourse)}`
            }
            <span className="dropdown-icon">▼</span>
          </button>
          
          {dropdownOpen && (
            <div className="dropdown-menu">
              <div 
                className="dropdown-item" 
                onClick={() => handleCourseSelect('all')}
              >
                All Courses
              </div>
              {courses && courses.length > 0 ? (
                courses.map(course => (
                  <div 
                    key={course.id} 
                    className="dropdown-item" 
                    onClick={() => handleCourseSelect(course.id)}
                  >
                    {course.courseName || course.name || `Course ${course.id}`}
                  </div>
                ))
              ) : (
                <div className="dropdown-item disabled">No courses found</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Announcements List */}
      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading announcements...</p>
        </div>
      ) : filteredAnnouncements && filteredAnnouncements.length > 0 ? (
        <div className="announcements-list">
          {filteredAnnouncements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <div className="announcement-header">
                <h2 className="announcement-title">{announcement.title}</h2>
                <div className="announcement-meta">
                  <span className="course-name">
                    {announcement.courseName || getCourseName(announcement.courseId)}
                  </span>
                  <span className="announcement-author">
                    By: {announcement.authorName}
                  </span>
                </div>
              </div>
              
              <div className="announcement-body">
                <p className="announcement-content">{announcement.content}</p>
                
                <div className="announcement-footer">
                  <span className="announcement-date">
                    {announcement.timestamp?.toLocaleDateString() || 'Unknown date'} 
                    {announcement.timestamp && ` at ${announcement.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                  </span>
                </div>
              </div>
              
              {announcement.attachments && announcement.attachments.length > 0 && (
                <div className="announcement-attachments">
                  <h3>Attachments:</h3>
                  <ul>
                    {announcement.attachments.map((attachment, index) => (
                      <li key={index}>
                        <a href={attachment.url} target="_blank" rel="noopener noreferrer">
                          {attachment.name || `Attachment ${index + 1}`}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-announcements">
          <p>No announcements found for {selectedCourse === 'all' ? 'your courses' : `course: ${getCourseName(selectedCourse)}`}.</p>
          {selectedCourse !== 'all' && (
            <button onClick={() => handleCourseSelect('all')} className="view-all-btn">
              View All Announcements
            </button>
          )}
        </div>
      )}
      
      <div className="back-button-container">
        <Link to="/dashboard" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Announcements; 