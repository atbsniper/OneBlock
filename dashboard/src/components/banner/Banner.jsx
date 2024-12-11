// src/components/banner/Banner.jsx
import React from "react";
import airUniversityLogo from "./FASTLogo.png";
import "./banner.css"; // Ensure the correct path to CSS

const Banner = () => {
  return (
    <div className="university-banner">
      <span className="university-name">FAST NUCES - Islamabad</span>
      <img src={airUniversityLogo} alt="FAST NUCES Logo" className="university-logo" />
    </div>
  );
};

export default Banner;
