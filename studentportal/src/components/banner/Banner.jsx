import React from "react";
import airUniversityLogo from "./oneblocklogo.png";
import "./banner.css"; 

const Banner = () => {
  return (
    <div className="university-banner">
      <span className="university-name">OneBlock</span>
      <img src={airUniversityLogo} alt="Air University Logo" className="university-logo" />
    </div>
  );
};

export default Banner;