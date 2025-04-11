import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Grades from './components/grades/Grades';
import Attendance from './components/attendance/Attendance';
import Notifications from './components/notifications/Notifications';
import Announcements from './components/announcements/Announcements';
import Profile from './components/profile/Profile';
import Diagnostics from './components/diagnostics';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const studentData = localStorage.getItem('studentData');
    if (studentData) {
      setIsAuthenticated(true);
    }
  }, []);
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const studentData = localStorage.getItem('studentData');
    
    if (!studentData) {
      return <Navigate to="/login" replace />;
    }
    
    return children;
  };
  
  return (
    <Router>
      <div className="app">
        <ToastContainer />
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/grades" element={
            <ProtectedRoute>
              <Grades />
            </ProtectedRoute>
          } />
          
          <Route path="/grades/:courseId" element={
            <ProtectedRoute>
              <Grades />
            </ProtectedRoute>
          } />
          
          <Route path="/attendance" element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          } />
          
          <Route path="/attendance/:courseId" element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          } />
          
          <Route path="/notifications" element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } />
          
          <Route path="/announcements" element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/diagnostics" element={
            <ProtectedRoute>
              <Diagnostics />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 