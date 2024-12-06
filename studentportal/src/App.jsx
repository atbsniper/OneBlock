import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/login/login";

import "./App.css";
import Dashboard from "./components/dashboard/dashboard";
import Attendance from "./components/attendence/attendence";
import Grading from "./components/grading/grading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddTeacher from "./components/addteacher/addteacher";
import Addstudents from "./components/addstudents/addstudents";
function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendence/:id" element={<Attendance />} />
          <Route path="/grading/:id" element={<Grading />} />
          <Route path="/addteacher" element={<AddTeacher />} />
          <Route path="/addstudents" element={<Addstudents />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;