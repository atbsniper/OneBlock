import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faGraduationCap, 
  faCalendarCheck, 
  faBell,
  faUser,
  faSignOutAlt,
  faBars,
  faTimes,
  faBullhorn
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';

const Navbar = () => {
  const [studentData, setStudentData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get student data from localStorage
  useEffect(() => {
    const storedStudentData = localStorage.getItem('studentData');
    if (storedStudentData) {
      setStudentData(JSON.parse(storedStudentData));
    }
  }, []);
  
  // Check for unread notifications
  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      // In a real implementation, this would fetch from Firebase
      // For now, we'll just simulate with a random number
      setUnreadNotifications(Math.floor(Math.random() * 5));
    };
    
    fetchUnreadNotifications();
    
    // Set up interval to check for notifications
    const intervalId = setInterval(fetchUnreadNotifications, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('studentData');
    navigate('/login');
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Close mobile menu when a link is clicked
  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/dashboard">
            <h1>Student Portal</h1>
          </Link>
        </div>
        
        <div className="navbar-toggle" onClick={toggleMobileMenu}>
          <FontAwesomeIcon icon={isMobileMenuOpen ? faTimes : faBars} />
        </div>
        
        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className={isActive('/dashboard') ? 'active' : ''}>
            <Link to="/dashboard" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faTachometerAlt} />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li className={isActive('/grades') ? 'active' : ''}>
            <Link to="/grades" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faGraduationCap} />
              <span>Grades</span>
            </Link>
          </li>
          
          <li className={isActive('/attendance') ? 'active' : ''}>
            <Link to="/attendance" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faCalendarCheck} />
              <span>Attendance</span>
            </Link>
          </li>
          <li className={isActive('/announcements') ? 'active' : ''}>
            <Link to="/announcements" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faBullhorn} />
              <span>Announcements</span>
            </Link>
          </li>

          
          <li className={isActive('/notifications') ? 'active' : ''}>
            <Link to="/notifications" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faBell} />
              <span>Notifications</span>
              {unreadNotifications > 0 && (
                <span className="notification-badge">{unreadNotifications}</span>
              )}
            </Link>
          </li>
          
          
        </ul>
        
        <div className={`navbar-user ${isMobileMenuOpen ? 'active' : ''}`}>
          <div className="user-info">
            {studentData && (
              <>
                <span className="user-name">{studentData.name}</span>
                <span className="user-roll">{studentData.rollNumber}</span>
              </>
            )}
          </div>
          
          <div className="user-actions">
            <Link to="/profile" className="user-profile" onClick={handleLinkClick}>
              <FontAwesomeIcon icon={faUser} />
            </Link>
            
            <button className="logout-btn" onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 