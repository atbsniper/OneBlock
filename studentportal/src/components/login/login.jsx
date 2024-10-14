import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./login.css";
import Banner from "../banner/Banner"; // Import the Banner component

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const q = query(
      collection(db, "teachers"),
      where("name", "==", username),
      where("password", "==", password)
    );
    try {
      const querySnapshot = await getDocs(q);
      console.log(querySnapshot.docs.length > 0);
      if (querySnapshot.docs.length > 0) {
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
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

  const handleAddteacher = () => {
    console.log("teacher");
  };

  useEffect(() => {
    if (localStorage.getItem("loggedInUser")) {
      navigate("/dashboard");
    }
  }, [localStorage.getItem("loggedInUser")]);

  return (
    <div>
      <Banner /> {/* Add the Banner component */}
      <div className="login-page-main">
        <h2>Login</h2>
        <div className="input-container">Username
          <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-container"> Password
          <input
            type="password"
            placeholder="Enter Password"
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
