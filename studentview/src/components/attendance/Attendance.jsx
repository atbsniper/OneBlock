import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarCheck, 
  faBook, 
  faArrowLeft,
  faCheckCircle,
  faTimesCircle,
  faCalendarAlt,
  faChartPie
} from '@fortawesome/free-solid-svg-icons';
import { db, getStudentCourses, getStudentAttendance } from '../../firebase/firebaseConfig';
import './Attendance.css';

const Attendance = () => {
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    attendancePercentage: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { courseId } = useParams();
  
  useEffect(() => {
    const fetchStudentAndCourses = async () => {
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
        
        // Set selected course if courseId is provided, otherwise use the first course
        if (courseId) {
          const course = studentCourses.find(course => course.id === courseId);
          if (course) {
            setSelectedCourse(course);
            await fetchAttendance(course.id, parsedStudentData.id);
          }
        } else if (studentCourses.length > 0) {
          setSelectedCourse(studentCourses[0]);
          await fetchAttendance(studentCourses[0].id, parsedStudentData.id);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentAndCourses();
  }, [courseId]);
  
  const fetchAttendance = async (courseId, studentId) => {
    try {
      setLoading(true);
      const attendanceData = await getStudentAttendance(studentId, courseId);
      
      // Sort attendance records by date (most recent first)
      const sortedRecords = attendanceData.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });
      
      setAttendanceRecords(sortedRecords);
      
      // Calculate attendance summary
      const totalDays = sortedRecords.length;
      const presentDays = sortedRecords.filter(record => record.status === 'present').length;
      const absentDays = totalDays - presentDays;
      const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
      
      setAttendanceSummary({
        totalDays,
        presentDays,
        absentDays,
        attendancePercentage
      });
      
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCourseChange = async (course) => {
    setSelectedCourse(course);
    if (studentData) {
      await fetchAttendance(course.id, studentData.id);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getAttendanceStatusClass = (status) => {
    return status === 'present' ? 'present' : 'absent';
  };
  
  const getAttendancePercentageClass = (percentage) => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    if (percentage >= 60) return 'fair';
    return 'poor';
  };
  
  if (loading) {
    return (
      <div className="attendance-page loading">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="attendance-page">
      <div className="attendance-header">
        <div className="attendance-title">
          <h1>
            <FontAwesomeIcon icon={faCalendarCheck} />
            Your Attendance
          </h1>
          <p>Track your attendance records for all courses</p>
        </div>
        
        <div className="course-selector">
          <label htmlFor="course-select">Select Course:</label>
          <select 
            id="course-select"
            value={selectedCourse?.id || ''}
            onChange={(e) => {
              const course = courses.find(c => c.id === e.target.value);
              if (course) handleCourseChange(course);
            }}
          >
            {courses.map(course => (
              <option key={course.id} value={course.id}>
                {course.name || course.id}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {!selectedCourse ? (
        <div className="no-course-selected">
          <FontAwesomeIcon icon={faBook} size="3x" />
          <p>
            {courses.length > 0 
              ? "Please select a course to view attendance" 
              : "You are not enrolled in any courses"}
          </p>
        </div>
      ) : (
        <>
          <div className="course-info">
            <h2>{selectedCourse.name || selectedCourse.id}</h2>
            {selectedCourse.code && <p className="course-code">{selectedCourse.code}</p>}
            {selectedCourse.instructor && (
              <p className="course-instructor">
                <strong>Instructor:</strong> {selectedCourse.instructor}
              </p>
            )}
          </div>
          
          <div className="attendance-summary">
            <div className="summary-card">
              <div className="summary-icon">
                <FontAwesomeIcon icon={faChartPie} />
              </div>
              <div className="summary-details">
                <h3>Attendance Rate</h3>
                <p className={`summary-value ${getAttendancePercentageClass(attendanceSummary.attendancePercentage)}`}>
                  {attendanceSummary.attendancePercentage}%
                </p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <div className="summary-details">
                <h3>Total Classes</h3>
                <p className="summary-value">
                  {attendanceSummary.totalDays}
                </p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FontAwesomeIcon icon={faCheckCircle} />
              </div>
              <div className="summary-details">
                <h3>Present</h3>
                <p className="summary-value present">
                  {attendanceSummary.presentDays}
                </p>
              </div>
            </div>
            
            <div className="summary-card">
              <div className="summary-icon">
                <FontAwesomeIcon icon={faTimesCircle} />
              </div>
              <div className="summary-details">
                <h3>Absent</h3>
                <p className="summary-value absent">
                  {attendanceSummary.absentDays}
                </p>
              </div>
            </div>
          </div>
          
          <div className="attendance-records">
            <div className="section-header">
              <h2>Attendance Records</h2>
            </div>
            
            {attendanceRecords.length === 0 ? (
              <div className="no-records">
                <p>No attendance records found for this course.</p>
              </div>
            ) : (
              <div className="records-table">
                <div className="table-header">
                  <div className="date-cell">Date</div>
                  <div className="status-cell">Status</div>
                </div>
                
                {attendanceRecords.map((record, index) => (
                  <div 
                    className={`table-row ${getAttendanceStatusClass(record.status)}`} 
                    key={record.date || index}
                  >
                    <div className="date-cell">{formatDate(record.date)}</div>
                    <div className={`status-cell ${getAttendanceStatusClass(record.status)}`}>
                      {record.status === 'present' ? (
                        <>
                          <FontAwesomeIcon icon={faCheckCircle} />
                          <span>Present</span>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faTimesCircle} />
                          <span>Absent</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
      
      <div className="back-button-container">
        <Link to="/dashboard" className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Attendance; 