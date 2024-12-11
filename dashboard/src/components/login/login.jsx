import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAdmin } from "../../firebase/firebaseConfig";
import "./login.css"; // Updated to .css
import logo from "./logo.png"; // Import the logo image
import admin from "./admin.png"; // Import the login illustration
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminDetails, setAdminDetails] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username === "") {
      setError("Please Enter Username");
      return;
    }
    if (password === "") {
      setError("Please Enter Password");
      return;
    }
    if (
      username === adminDetails.username &&
      password === adminDetails.password
    ) {
      localStorage.setItem("loggedInUserLog", username);
      navigate("/dashboard");
      return;
    } else {
      setError("Invalid Username or Password");
      return;
    }
  };

  useEffect(() => {
    if (localStorage.getItem("loggedInUserLog") === "admin") {
      navigate("/dashboard");
    } else {
      console.log("test");
    }
  }, [localStorage.getItem("loggedInUserLog")]);

  useEffect(() => {
    const getAdminData = async () => {
      const test = await getAdmin();
      console.log(`test: ${JSON.stringify(test)}`);
      console.log(test);
      setAdminDetails(test);
    };
    getAdminData();
  }, []);

  return (
    <div className="login-container">
      <div className="left-section">
        <img src={admin} alt="admin" className="login-image" />
      </div>
      <div className="divider"></div>
      <div className="right-section">
        <div className="logo">
          <img src={logo} alt="Company Logo" />
        </div>
        <h2>Login Here!</h2>
        <div className="input-container">
          <i className="fas fa-user icon icon-user"></i>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container">
          <i className="fas fa-lock icon icon-lock"></i>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button onClick={handleLogin}>Login</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
