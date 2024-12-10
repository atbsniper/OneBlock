import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/dashboardpage";
import Login from "./components/login/login";
import Alerts from "./components/alerts/alerts";
import Report from "./components/logviewer/report";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/report" element={<Report />} />
          
        </Routes>
      </Router>
    </>
  );
}

export default App;
