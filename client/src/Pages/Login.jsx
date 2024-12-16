import React, { useState } from "react";
import "./login.css";
import backgroundImage from "../../src/assets/backg.png"; 
import { useNavigate } from "react-router-dom"; 


const LoginPage = () => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const constantUsername = "sarath"; 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: constantUsername, password }),
      });

      const data = await response.json();

      if (response.ok) {
        
        navigate(`/adminview?isadmin=true`)
        
   

      } else {
        setErrorMessage(data.message || "Invalid password!");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="login-container"
      
    >
        <img src={backgroundImage} alt="pddleimg"></img>
      <form className="login-form" onSubmit={handleLogin}>
        <div className="input-group">
          <input
            type="text"
            value={constantUsername}
            disabled
            placeholder="Username"
            className="constant-username"
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default LoginPage;
