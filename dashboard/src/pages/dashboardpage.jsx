import React from "react";
import Dashboard from "../components/dashboard/dashboard";
import AsideBar from "../components/asidebar/aside";

function DashboardPage() {
  return (
    <div className="dashboard-main-wrapper">
      <AsideBar />
      <div className="content-area">
        <div className="after-content-wrap">
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
