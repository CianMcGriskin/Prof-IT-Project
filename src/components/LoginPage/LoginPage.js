import React, { useState } from "react";
import axios from 'axios';
import "./LoginPage.css";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Check for the Auth cookie
  const hasAuthCookie = Cookies.get('Auth');
  if (hasAuthCookie) 
    window.location.href = "/timetable";

  const handleSubmit = (event) => {
    event.preventDefault();
    // Make get to login expressJS with email and password credentials
    axios
      .post("http://localhost:4000/", { email, password })
      .then((response) => {
        if(response.data === "success"){
          // Set expiry date for the cookie
          var expiryDate = new Date();
          expiryDate.setTime(expiryDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days in milliseconds

          // Set the cookie with the expiry date
          document.cookie = "Auth=" + email +"; expires=" + expiryDate.toUTCString() + "; path=/";
        }
        // Navigate to apps homepage
        window.location.href = "/timetable";
      })
      .catch((error) => {
        console.error(error.data); // Show an error message to the user
      });
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>
        <div className="login-input-group">
          {/* Email Input Field */}
          <label htmlFor="email" id="CenterText">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="login-input-group">
          {/* Password Input Field */}
          <label htmlFor="password" id="CenterText">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
            Don't have an account?{" "}
            <Link to="/register">
                <span style={{ color: "blue", cursor: "pointer" }}>Sign up</span>
            </Link>
        </div>
        
        <button type="submit" className="login-submit-button">
          Login
        </button>

      </form>
    </div>
  );
};

export default LoginPage;
