import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if already logged in
    const studentData = localStorage.getItem('studentData');
    if (studentData) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  return (
    <div className="register-container">
      <div className="register-card">
        <FontAwesomeIcon icon={faUserPlus} className="register-icon" />
        <h1 className="register-title">Registration</h1>
        <div className="register-message">
          <p>Student accounts are created by administrators only.</p>
          <p>Please contact your school administrator to get registered in the system.</p>
        </div>
        <button className="register-button" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default Register; 