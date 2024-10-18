import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import ReCAPTCHA from "react-google-recaptcha"; // Import reCAPTCHA component
import "./login.css";
import Banner from "../banner/Banner"; // Import the Banner component

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for show/hide password
  const [recaptchaVerified, setRecaptchaVerified] = useState(false); // State for reCAPTCHA verification
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!recaptchaVerified) {
      setError("Please verify the reCAPTCHA");
      return;
    }
    const q = query(
      collection(db, "teachers"),
      where("name", "==", username),
      where("password", "==", password)
    );
    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          localStorage.setItem("loggedInUser", JSON.stringify(user));
          navigate("/dashboard"); // Redirect to dashboard page
        });
      } else {
        setError("Invalid Username or Password");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onRecaptchaChange = (value) => {
    if (value) {
      setRecaptchaVerified(true); // Set to true if reCAPTCHA is successfully verified
    } else {
      setRecaptchaVerified(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("loggedInUser")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div>
      <Banner /> {/* Add the Banner component */}
      <div className="login-page-main">
        <h2>Instructor Login</h2>
        <div className="input-container">
          <FontAwesomeIcon icon={faUser} className="input-icon" /> {/* User icon */}
          <div className="separator"></div> {/* Separator line */}
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container">
          <FontAwesomeIcon icon={faLock} className="input-icon" /> {/* Lock icon */}
          <div className="separator"></div> {/* Separator line */}
          <input
            type={showPassword ? "text" : "password"} // Toggle password visibility
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="show-password-container">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)} // Toggle show/hide password
          />
          <label htmlFor="showPassword">Show Password</label>
        </div>

        {/* reCAPTCHA */}
        <ReCAPTCHA
          sitekey="6Le9NWIqAAAAAAnY4BoXjbtzgowTKPGpdsKYekwC" // Replace with your actual reCAPTCHA site key
          onChange={onRecaptchaChange}
          className="recaptcha-container" // Add a class for CSS styling
        />

        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;