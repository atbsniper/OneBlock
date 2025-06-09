import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faArrowLeft,
  faIdCard,
  faEnvelope,
  faPhone,
  faCalendarAlt,
  faGraduationCap,
  faMapMarkerAlt,
  faEdit,
  faKey,
  faEye,
  faEyeSlash,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { db } from '../../firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import './Profile.css';

const Profile = () => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    program: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isDefaultPassword, setIsDefaultPassword] = useState(false);
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // Get student data from localStorage
        const storedStudentData = localStorage.getItem('studentData');
        if (!storedStudentData) {
          navigate('/login');
          return;
        }
        
        const parsedStudentData = JSON.parse(storedStudentData);
        setStudentData(parsedStudentData);
        
        // Check if using default password
        setIsDefaultPassword(parsedStudentData.password === "student");
        
        // Initialize form data with student data
        setFormData({
          name: parsedStudentData.name || '',
          email: parsedStudentData.email || '',
          phone: parsedStudentData.phone || '',
          address: parsedStudentData.address || '',
          program: parsedStudentData.program || '',
          profileImage: parsedStudentData.profileImage || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error loading your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentData();
  }, [navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      // Update student data in Firestore
      const studentRef = doc(db, 'students', studentData.id);
      await updateDoc(studentRef, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        program: formData.program
      });
      
      // Update local state
      const updatedStudentData = {
        ...studentData,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        program: formData.program
      };
      
      setStudentData(updatedStudentData);
      
      // Update localStorage
      localStorage.setItem('studentData', JSON.stringify(updatedStudentData));
      
      // Exit edit mode
      setIsEditing(false);
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (formData.currentPassword !== studentData.password) {
      toast.error('Current password is incorrect');
      return;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setLoading(true);
      // Update password in Firestore
      const studentRef = doc(db, 'students', studentData.id);
      await updateDoc(studentRef, {
        password: formData.newPassword
      });
      
      // Update local state
      const updatedStudentData = {
        ...studentData,
        password: formData.newPassword
      };
      
      setStudentData(updatedStudentData);
      setIsDefaultPassword(formData.newPassword === "student");
      
      // Update localStorage
      localStorage.setItem('studentData', JSON.stringify(updatedStudentData));
      
      // Reset password fields
      setFormData(prevData => ({
        ...prevData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      // Exit password change mode
      setIsChangingPassword(false);
      
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('studentData');
    navigate('/login');
  };
  
  const togglePasswordVisibility = (field) => {
    if (field === 'current') {
      setShowCurrentPassword(!showCurrentPassword);
    } else if (field === 'new') {
      setShowNewPassword(!showNewPassword);
    }
  };
  
  if (loading) {
    return (
      <div className="profile-page loading">
        <div className="loader"></div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-title">
          <h1>
            <FontAwesomeIcon icon={faUser} />
            Your Profile
          </h1>
          <p>View and manage your personal information</p>
        </div>
        
        {isDefaultPassword && (
          <div className="password-warning">
            <FontAwesomeIcon icon={faInfoCircle} />
            <p>You are using the default password. Please change it for security reasons.</p>
          </div>
        )}
      </div>
      
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            {studentData.profileImage ? (
              <img src={studentData.profileImage} alt={studentData.name} />
            ) : (
              <div className="avatar-placeholder">
                {studentData.name.charAt(0)}
              </div>
            )}
          </div>
          
          <h2>{studentData.name}</h2>
          <p className="student-id">{studentData.rollNumber}</p>
          
          <div className="profile-actions">
            <button 
              className="edit-profile-btn"
              onClick={() => {
                setIsEditing(!isEditing);
                setIsChangingPassword(false);
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            
            <button 
              className="change-password-btn"
              onClick={() => {
                setIsChangingPassword(!isChangingPassword);
                setIsEditing(false);
              }}
            >
              <FontAwesomeIcon icon={faKey} />
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </button>
            
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="profile-content">
          {!isEditing && !isChangingPassword ? (
            <div className="profile-details">
              <h3>Personal Information</h3>
              
              <div className="detail-row">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faUser} />
                  Full Name
                </div>
                <div className="detail-value">{studentData.name}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faIdCard} />
                  Roll Number
                </div>
                <div className="detail-value">{studentData.rollNumber}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email
                </div>
                <div className="detail-value">{studentData.email || 'Not provided'}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faPhone} />
                  Phone
                </div>
                <div className="detail-value">{studentData.phone || 'Not provided'}</div>
              </div>
              
              <h3>Academic Information</h3>
              
              <div className="detail-row">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  Program
                </div>
                <div className="detail-value">{studentData.program || 'Not specified'}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Enrollment Date
                </div>
                <div className="detail-value">
                  {studentData.enrollmentDate 
                    ? new Date(studentData.enrollmentDate).toLocaleDateString() 
                    : 'Not available'}
                </div>
              </div>
              
              <h3>Contact Information</h3>
              
              <div className="detail-row">
                <div className="detail-label">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Address
                </div>
                <div className="detail-value">{studentData.address || 'Not provided'}</div>
              </div>
            </div>
          ) : isEditing ? (
            <form className="edit-profile-form" onSubmit={handleProfileUpdate}>
              <h3>Edit Profile</h3>
              
              <div className="form-group">
                <label htmlFor="name">
                  <FontAwesomeIcon icon={faUser} />
                  Full Name
                </label>
                <input 
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email
                </label>
                <input 
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  <FontAwesomeIcon icon={faPhone} />
                  Phone
                </label>
                <input 
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="program">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  Program
                </label>
                <input 
                  type="text"
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  Address
                </label>
                <textarea 
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <form className="change-password-form" onSubmit={handlePasswordChange}>
              <h3>Change Password</h3>
              
              {isDefaultPassword && (
                <div className="default-password-warning">
                  <FontAwesomeIcon icon={faInfoCircle} />
                  <p>You are currently using the default password. For security reasons, please change it to a unique password.</p>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-container">
                  <input 
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    <FontAwesomeIcon icon={showCurrentPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <div className="password-input-container">
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <button 
                    type="button"
                    className="toggle-password"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input 
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="password-requirements">
                <p>Password must be at least 6 characters long</p>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="save-btn" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsChangingPassword(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      
      <Link to="/dashboard" className="back-button">
        <FontAwesomeIcon icon={faArrowLeft} /> Back to Dashboard
      </Link>
    </div>
  );
};

export default Profile; 