import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./RegisterPage.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyID, setCompanyID] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate the entered information
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Make API call or perform other action with the entered information
    console.log("Name:", firstName + surname);
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="register-container">
    <form className="register-form" id="CenterText" onSubmit={handleSubmit}>

      <h2>Sign Up</h2>
      <div className="form-group">
        <label htmlFor="firstName" >First Name</label>
        <input
          type="text"
          id="firstName"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="surname">Surname</label>
        <input
          type="text"
          id="surname"
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
     </div>

      <div className="form-group">
        <label htmlFor="companyID">Company ID</label>
        <input
          type="text"
          id="companyID"
          value={companyID}
          onChange={(event) => setCompanyID(event.target.value)}
        />
        Please note that only employees can register, manager accounts are made seperatley
        </div>
      <div>
            Back to {" "}
            <Link to="/">
                <span style={{ color: "blue", cursor: "pointer" }}>login.</span>
            </Link>
        </div>
      <button type="submit">Sign Up</button>
    </form>
    </div>
  );
};

export default Register;
