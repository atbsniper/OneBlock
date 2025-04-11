import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faInfoCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import './Login.css';

const Login = ({ setIsAuthenticated }) => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in
    const studentData = localStorage.getItem('studentData');
    if (studentData) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!rollNumber) {
      toast.error('Please enter your roll number');
      return;
    }
    
    if (!password) {
      toast.error('Please enter your password');
      return;
    }
    
    // Default password check
    const defaultPassword = "student";
    if (password !== defaultPassword) {
      toast.error('Invalid password. Default password is "student"');
      return;
    }
    
    setLoading(true);
    
    try {
      // Query Firestore for the student with matching roll number
      const studentsRef = collection(db, 'students');
      const q = query(
        studentsRef, 
        where('rollNo', '==', rollNumber)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        toast.error('Student with this roll number is not registered in the system');
        setLoading(false);
        return;
      }
      
      // Get the student data
      const studentDoc = querySnapshot.docs[0];
      const studentData = {
        id: studentDoc.id,
        ...studentDoc.data(),
        password: defaultPassword // Store password in student data for changing password later
      };
      
      // Save to localStorage
      localStorage.setItem('studentData', JSON.stringify(studentData));
      
      // Update authentication state
      setIsAuthenticated(true);
      
      // Navigate to dashboard
      toast.success(`Welcome, ${studentData.name}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left-panel">
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Enter your account details</p>
        
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <div className="input-container">
              <FontAwesomeIcon icon={faUser} className="input-icon" />
              <input 
                type="text" 
                placeholder="Roll Number" 
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="form-control"
                disabled={loading}
                style={{ textIndent: '0', paddingLeft: '3rem' }}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="input-container">
              <FontAwesomeIcon icon={faLock} className="input-icon" />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                disabled={loading}
                style={{ textIndent: '0', paddingLeft: '3rem' }}
              />
            </div>
          </div>
          
          <div className="show-password-container">
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              disabled={loading}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>
          
          <a href="#" className="forgot-password" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="signup-link">
          <p>Don't have an account?</p>
          <button className="signup-button" onClick={(e) => e.preventDefault()}>Sign up</button>
        </div>
        
        <div className="login-footer">
          <p>Only registered students can access the portal. Please contact your administrator if you're having trouble logging in.</p>
        </div>
      </div>
      
      <div className="login-right-panel">
        <h1 className="welcome-title">Welcome to</h1>
        <h2 className="welcome-subtitle">student portal</h2>
        <p className="welcome-text">Login to access your account</p>
        <img 
          src="/login-image.jpeg" 
          alt="Login illustration" 
          className="illustration"
        />
      </div>
    </div>
  );
};

export default Login; 