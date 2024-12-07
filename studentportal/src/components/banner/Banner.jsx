import React from "react";
import airUniversityLogo from "./oneblocklogo.png";
import "./banner.css"; 

const Banner = () => {
  return (
    <div className="university-banner">
      <span className="university-name">FAST NUCES - Islamabad</span>
      <img src={airUniversityLogo} alt="FAST NUCES Logo" className="university-logo" />
    </div>
  );
};

export default Banner;
