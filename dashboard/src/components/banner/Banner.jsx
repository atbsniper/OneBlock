
import React from "react";
import airUniversityLogo from "./fastlogo.png";
import "./banner.css"; // Ensure the correct path to CSS

const Banner = () => {
  return (
    <div className="university-banner">
      <span className="university-name">FAST NUCES</span>
      <img src={fastlogo} alt="FAST LOGO" className="university-logo" />
    </div>
  );
};

export default Banner;
