import React, { useState } from "react";
import "./LoginPage.css";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Make API call or perform other action with the entered credentials
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-title">Login</h1>
        <div className="login-input-group">
          <label htmlFor="email" id="CenterText">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="password" id="CenterText">Password</label>
          <input
            type="password"
            id="password"
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
