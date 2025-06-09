import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faBook, 
  faArrowLeft,
  faClipboardCheck,
  faFileAlt,
  faChalkboardTeacher,
  faTrophy,
  faChartLine,
  faSync,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { db, getStudentCourses, getStudentGrades } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Grades.css';

const Grades = () => {
  const [studentData, setStudentData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [gradesData, setGradesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
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
            await fetchGrades(course.id, parsedStudentData.id);
          }
        } else if (studentCourses.length > 0) {
          setSelectedCourse(studentCourses[0]);
          await fetchGrades(studentCourses[0].id, parsedStudentData.id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading grades data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentAndCourses();
  }, [courseId]);
  
  const fetchGrades = async (courseId, studentId) => {
    try {
      setLoading(true);
      const gradesData = await getStudentGrades(studentId, courseId);
      
      if (gradesData.length > 0) {
        setGradesData(gradesData[0]);
      } else {
        setGradesData(null);
      }
      
    } catch (error) {
      console.error('Error fetching grades:', error);
      toast.error('Error loading grades');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCourseChange = async (course) => {
    setSelectedCourse(course);
    if (studentData) {
      await fetchGrades(course.id, studentData.id);
    }
  };
  
  const refreshGrades = async () => {
    if (refreshing || !studentData || !selectedCourse) return;
    
    setRefreshing(true);
    try {
      await fetchGrades(selectedCourse.id, studentData.id);
      toast.success('Grades refreshed');
    } catch (error) {
      console.error('Error refreshing grades:', error);
      toast.error('Error refreshing grades');
    } finally {
      setRefreshing(false);
    }
  };
  
  const getGradeColor = (grade) => {
    if (grade >= 90) return 'excellent';
    if (grade >= 80) return 'good';
    if (grade >= 70) return 'average';
    if (grade >= 60) return 'fair';
    return 'poor';
  };
  
  const renderGradeItem = (label, value, icon) => {
    return (
      <div className="grade-item">
        <div className="grade-icon">
          <FontAwesomeIcon icon={icon} />
        </div>
        <div className="grade-details">
          <h3>{label}</h3>
          <p className={`grade-value ${getGradeColor(value || 0)}`}>
            {value !== undefined && value !== null ? value : 'N/A'}
          </p>
        </div>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="grades-page loading">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="grades-page">
      <div className="grades-header">
        <div className="grades-title">
          <h1>
            <FontAwesomeIcon icon={faGraduationCap} />
            Your Grades
          </h1>
          <p>View your academic performance for all courses</p>
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
          
          <button 
            className="refresh-button" 
            onClick={refreshGrades}
            disabled={refreshing}
          >
            <FontAwesomeIcon icon={refreshing ? faSpinner : faSync} spin={refreshing} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {!selectedCourse ? (
        <div className="no-course-selected">
          <FontAwesomeIcon icon={faBook} size="3x" />
          <p>
            {courses.length > 0 
              ? "Please select a course to view grades" 
              : "You are not enrolled in any courses"}
          </p>
        </div>
      ) : !gradesData ? (
        <div className="no-grades">
          <FontAwesomeIcon icon={faClipboardCheck} size="3x" />
          <p>No grades available for this course yet</p>
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
          
          <div className="grade-overview">
            <div className="overall-grade">
              <h2>Overall Grade</h2>
              <div className={`grade-circle ${getGradeColor(gradesData.overall || 0)}`}>
                <span>{gradesData.overall || 0}</span>
              </div>
            </div>
            
            <div className="grade-summary">
              {renderGradeItem('Quizzes', gradesData.quizzes, faClipboardCheck)}
              {renderGradeItem('Assignments', gradesData.assignments, faFileAlt)}
              {renderGradeItem('Midterm', gradesData.midterm, faChalkboardTeacher)}
              {renderGradeItem('Final', gradesData.final, faTrophy)}
            </div>
          </div>
          
          <div className="grade-details">
            <div className="detail-section">
              <h3>
                <FontAwesomeIcon icon={faClipboardCheck} />
                Quiz Scores
              </h3>
              <div className="detail-cards">
                {gradesData.quizDetails && gradesData.quizDetails.map((score, index) => (
                  <div className="detail-card" key={`quiz-${index}`}>
                    <h4>Quiz {index + 1}</h4>
                    <p className={`detail-score ${getGradeColor(score || 0)}`}>
                      {score || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>
                <FontAwesomeIcon icon={faFileAlt} />
                Assignment Scores
              </h3>
              <div className="detail-cards">
                {gradesData.assignmentDetails && gradesData.assignmentDetails.map((score, index) => (
                  <div className="detail-card" key={`assignment-${index}`}>
                    <h4>Assignment {index + 1}</h4>
                    <p className={`detail-score ${getGradeColor(score || 0)}`}>
                      {score || 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-section">
              <h3>
                <FontAwesomeIcon icon={faChartLine} />
                Exam Scores
              </h3>
              <div className="detail-cards exams">
                <div className="detail-card">
                  <h4>Midterm</h4>
                  <p className={`detail-score ${getGradeColor(gradesData.midterm || 0)}`}>
                    {gradesData.midterm || 'N/A'}
                  </p>
                </div>
                
                <div className="detail-card">
                  <h4>Final</h4>
                  <p className={`detail-score ${getGradeColor(gradesData.final || 0)}`}>
                    {gradesData.final || 'N/A'}
                  </p>
                </div>
              </div>
            </div>
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

export default Grades; 