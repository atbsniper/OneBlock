import React from "react";
import NUCESLogo from "./oneblocklogo.png";
import "./banner.css"; 

const Banner = () => {
  return (
    <div className="university-banner">
      <span className="university-name">OneBlock</span>
      <img src={NUCESLogo} alt="FAST NUCES Logo" className="university-logo" />
    </div>
  );
};

export default Banner;