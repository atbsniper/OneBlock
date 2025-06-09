import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faCalendarCheck, 
  faBell, 
  faBookOpen,
  faChartLine,
  faCheckCircle,
  faTimesCircle,
  faInfoCircle,
  faUser,
  faSync
} from '@fortawesome/free-solid-svg-icons';
import { db, getStudentCourses } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    overallAttendance: 0,
    overallGrade: 0,
    unreadNotifications: 0,
    enrolledCourses: 0
  });
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get student data from localStorage
        const storedStudentData = localStorage.getItem('studentData');
        if (!storedStudentData) {
          return;
        }
        
        const parsedStudentData = JSON.parse(storedStudentData);
        setStudentData(parsedStudentData);
        
        // Fetch student's courses
        const studentCourses = await getStudentCourses(parsedStudentData.id);
        setCourses(studentCourses);
        
        // Set up listeners for real-time updates
        setupRealTimeListeners(parsedStudentData.id, studentCourses);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading dashboard data');
        setLoading(false);
      }
    };
    
    fetchStudentData();
    
    // Cleanup listeners
    return () => {
      if (window.notificationsUnsubscribe) {
        window.notificationsUnsubscribe();
      }
      if (window.attendanceUnsubscribe) {
        window.attendanceUnsubscribe();
      }
      if (window.gradesUnsubscribe) {
        window.gradesUnsubscribe();
      }
    };
  }, []);
  
  const setupRealTimeListeners = (studentId, studentCourses) => {
    try {
      console.log("Setting up real-time listeners for Dashboard with studentId:", studentId);
      
      // 1. Setup notifications listener
      const notificationsRef = collection(db, 'notifications');
      const notificationsQuery = query(
        notificationsRef,
        where('studentId', '==', studentId),
        orderBy('timestamp', 'desc')
      );
      
      window.notificationsUnsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
        // Count unread notifications
        const unreadCount = snapshot.docs.filter(doc => !doc.data().read).length;
        console.log(`Dashboard real-time listener found ${unreadCount} unread notifications for studentId: ${studentId}`);
        setStats(prevStats => ({
          ...prevStats,
          unreadNotifications: unreadCount
        }));
        
        // If no notifications found but studentId exists, try debugging
        if (snapshot.docs.length === 0) {
          console.log("No notifications found with primary studentId, will try a direct query");
          
          // Try a direct query without filters to see what's in the notifications collection
          getDocs(collection(db, 'notifications'))
            .then(allDocsSnapshot => {
              console.log(`Total notifications in Firestore: ${allDocsSnapshot.size}`);
              
              // Look for potential student ID mismatches
              const studentIds = new Set();
              allDocsSnapshot.forEach(doc => {
                const data = doc.data();
                if (data.studentId) {
                  studentIds.add(data.studentId);
                }
              });
              
              console.log("Available studentIds in notifications collection:", [...studentIds]);
              
              // Suggest potential matches
              if (studentIds.size > 0) {
                const potentialMatches = [...studentIds].filter(id => 
                  id.includes(studentId) || studentId.includes(id)
                );
                
                if (potentialMatches.length > 0) {
                  console.log("Potential studentId matches:", potentialMatches);
                }
              }
            })
            .catch(error => console.error("Error in direct notifications query:", error));
        }
      });
      
      // 2. Calculate initial stats and set up other listeners
      calculateStats(studentId, studentCourses);
      
    } catch (error) {
      console.error('Error setting up listeners:', error);
      // Fallback to non-realtime calculation
      calculateStats(studentId, studentCourses);
    }
  };
  
  const calculateStats = async (studentId, studentCourses) => {
    try {
      // Set enrolled courses count
      const enrolledCourses = studentCourses.length;
      
      // Calculate overall attendance
      let totalAttendanceDays = 0;
      let presentDays = 0;
      
      // Get attendance data
      const attendanceRef = collection(db, 'attendance');
      const attendanceQuery = query(
        attendanceRef,
        where('studentId', '==', studentId)
      );
      
      // Set up attendance listener
      window.attendanceUnsubscribe = onSnapshot(attendanceQuery, (snapshot) => {
        totalAttendanceDays = snapshot.size;
        presentDays = snapshot.docs.filter(doc => doc.data().status === 'present').length;
        
        const overallAttendance = totalAttendanceDays > 0
          ? Math.round((presentDays / totalAttendanceDays) * 100)
          : 0;
          
        setStats(prevStats => ({
          ...prevStats,
          overallAttendance,
          enrolledCourses
        }));
      }, (error) => {
        console.error('Error in attendance listener:', error);
        // Fallback to regular fetch
        fetchAttendanceStats(studentId, enrolledCourses);
      });
      
      // Set up grades listener
      const gradesRef = collection(db, 'grades');
      const gradesQuery = query(
        gradesRef,
        where('studentId', '==', studentId)
      );
      
      window.gradesUnsubscribe = onSnapshot(gradesQuery, (snapshot) => {
        let totalGradePoints = 0;
        let totalCourses = 0;
        
        snapshot.forEach(doc => {
          const gradeData = doc.data();
          // Calculate average grade (assuming grades are on a scale of 0-100)
          const courseGrade = (
            (gradeData.quizzes || 0) +
            (gradeData.assignments || 0) +
            (gradeData.midterm || 0) +
            (gradeData.final || 0)
          ) / 4;
          
          totalGradePoints += courseGrade;
          totalCourses++;
        });
        
        const overallGrade = totalCourses > 0
          ? Math.round(totalGradePoints / totalCourses)
          : 0;
          
        setStats(prevStats => ({
          ...prevStats,
          overallGrade
        }));
        
        // Finally, set loading to false once all data is loaded
        setLoading(false);
      }, (error) => {
        console.error('Error in grades listener:', error);
        // Fallback to regular fetch
        fetchGradeStats(studentId, enrolledCourses);
      });
      
    } catch (error) {
      console.error('Error calculating stats:', error);
      setLoading(false);
      toast.error('Error calculating statistics');
    }
  };
  
  const fetchAttendanceStats = async (studentId, enrolledCourses) => {
    try {
      let totalAttendanceDays = 0;
      let presentDays = 0;
      
      const attendanceRef = collection(db, 'attendance');
      const attendanceQuery = query(
        attendanceRef,
        where('studentId', '==', studentId)
      );
      
      const attendanceSnapshot = await getDocs(attendanceQuery);
      
      totalAttendanceDays = attendanceSnapshot.size;
      presentDays = attendanceSnapshot.docs.filter(doc => doc.data().status === 'present').length;
      
      const overallAttendance = totalAttendanceDays > 0
        ? Math.round((presentDays / totalAttendanceDays) * 100)
        : 0;
        
      setStats(prevStats => ({
        ...prevStats,
        overallAttendance,
        enrolledCourses
      }));
    } catch (error) {
      console.error('Error fetching attendance stats:', error);
    }
  };
  
  const fetchGradeStats = async (studentId, enrolledCourses) => {
    try {
      let totalGradePoints = 0;
      let totalCourses = 0;
      
      const gradesRef = collection(db, 'grades');
      const gradesQuery = query(
        gradesRef,
        where('studentId', '==', studentId)
      );
      
      const gradesSnapshot = await getDocs(gradesQuery);
      
      gradesSnapshot.forEach(doc => {
        const gradeData = doc.data();
        // Calculate average grade
        const courseGrade = (
          (gradeData.quizzes || 0) +
          (gradeData.assignments || 0) +
          (gradeData.midterm || 0) +
          (gradeData.final || 0)
        ) / 4;
        
        totalGradePoints += courseGrade;
        totalCourses++;
      });
      
      const overallGrade = totalCourses > 0
        ? Math.round(totalGradePoints / totalCourses)
        : 0;
        
      setStats(prevStats => ({
        ...prevStats,
        overallGrade
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching grade stats:', error);
      setLoading(false);
    }
  };
  
  const refreshDashboard = async () => {
    if (refreshing || !studentData) return;
    
    setRefreshing(true);
    try {
      // Fetch courses again
      const studentCourses = await getStudentCourses(studentData.id);
      setCourses(studentCourses);
      
      // Recalculate stats
      await Promise.all([
        fetchAttendanceStats(studentData.id, studentCourses.length),
        fetchGradeStats(studentData.id, studentCourses.length)
      ]);
      
      toast.success('Dashboard refreshed');
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast.error('Error refreshing dashboard');
    } finally {
      setRefreshing(false);
    }
  };
  
  // Helper function to get the appropriate color class based on grade
  const getGradeColorClass = (grade) => {
    if (grade >= 90) return 'excellent';
    if (grade >= 80) return 'good';
    if (grade >= 70) return 'average';
    if (grade >= 60) return 'fair';
    return 'poor';
  };
  
  // Helper function to get the appropriate color class based on attendance
  const getAttendanceColorClass = (attendance) => {
    if (attendance >= 90) return 'excellent';
    if (attendance >= 80) return 'good';
    if (attendance >= 70) return 'average';
    if (attendance >= 60) return 'fair';
    return 'poor';
  };
  
  if (loading) {
    return (
      <div className="dashboard-page loading">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="welcome-message">
          <h1>Welcome, {studentData?.name || 'Student'}</h1>
          <p>Your student dashboard gives you quick access to your academic information</p>
        </div>
        
        <div className="student-profile">
          <div className="profile-icon">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div className="profile-details">
            <h3>{studentData?.name}</h3>
            <p><strong>Roll Number:</strong> {studentData?.rollNo}</p>
            <p><strong>Program:</strong> {studentData?.program || 'Not specified'}</p>
            <button 
              className="refresh-button" 
              onClick={refreshDashboard}
              disabled={refreshing}
            >
              <FontAwesomeIcon icon={faSync} spin={refreshing} />
              {refreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="stat-details">
            <h3>Overall Grade</h3>
            <p className={`stat-value ${getGradeColorClass(stats.overallGrade)}`}>
              {stats.overallGrade}%
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faCalendarCheck} />
          </div>
          <div className="stat-details">
            <h3>Attendance</h3>
            <p className={`stat-value ${getAttendanceColorClass(stats.overallAttendance)}`}>
              {stats.overallAttendance}%
            </p>
          </div>
        </div>
        
        <Link to="/notifications" className="stat-card notification-stat">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faBell} />
            {stats.unreadNotifications > 0 && (
              <span className="notification-indicator">{stats.unreadNotifications}</span>
            )}
          </div>
          <div className="stat-details">
            <h3>Notifications</h3>
            <p className="stat-value">
              {stats.unreadNotifications} unread
            </p>
          </div>
        </Link>
        
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faBookOpen} />
          </div>
          <div className="stat-details">
            <h3>Courses</h3>
            <p className="stat-value">
              {stats.enrolledCourses} enrolled
            </p>
          </div>
        </div>
      </div>
      
      <div className="courses-section">
        <div className="section-header">
          <h2>My Courses</h2>
        </div>
        
        <div className="courses-grid">
          {courses.length > 0 ? (
            courses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <h3>{course.name}</h3>
                  <p>{course.code}</p>
                </div>
                
                <div className="course-body">
                  <p><strong>Instructor:</strong> {course.instructor || 'Not assigned'}</p>
                  <p><strong>Schedule:</strong> {course.schedule || 'Not scheduled'}</p>
                </div>
                
                <div className="course-actions">
                  <Link to={`/grades/${course.id}`} className="btn-outline-primary">
                    <FontAwesomeIcon icon={faGraduationCap} /> Grades
                  </Link>
                  <Link to={`/attendance/${course.id}`} className="btn-outline-primary">
                    <FontAwesomeIcon icon={faCalendarCheck} /> Attendance
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="no-courses">
              <FontAwesomeIcon icon={faInfoCircle} size="2x" />
              <p>You are not enrolled in any courses yet.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="quick-links-section">
        <div className="section-header">
          <h2>Quick Links</h2>
        </div>
        
        <div className="quick-links-grid">
          <Link to="/grades" className="quick-link-card">
            <FontAwesomeIcon icon={faGraduationCap} />
            <h3>Grades</h3>
            <p>View your grades for all courses</p>
          </Link>
          
          <Link to="/attendance" className="quick-link-card">
            <FontAwesomeIcon icon={faCalendarCheck} />
            <h3>Attendance</h3>
            <p>Check your attendance records</p>
          </Link>
          
          <Link to="/notifications" className="quick-link-card">
            <FontAwesomeIcon icon={faBell} />
            <h3>Notifications</h3>
            <p>View important announcements</p>
            {stats.unreadNotifications > 0 && (
              <span className="badge">{stats.unreadNotifications}</span>
            )}
          </Link>
          
          <Link to="/profile" className="quick-link-card">
            <FontAwesomeIcon icon={faUser} />
            <h3>Profile</h3>
            <p>Manage your student profile</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 