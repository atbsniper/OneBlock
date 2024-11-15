// src/components/banner/Banner.jsx
import React from "react";
import airUniversityLogo from "./airUniLogo.png";
import "./banner.css"; // Ensure the correct path to CSS

const Banner = () => {
  return (
    <div className="university-banner">
      <span className="university-name">Air University Aerospace & Aviation Kamra Campus</span>
      <img src={airUniversityLogo} alt="Air University Logo" className="university-logo" />
    </div>
  );
};

export default Banner;
