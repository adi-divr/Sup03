import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./navbar.css"; 

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="navbar-container-admin">
      <div className="navbar-admin">
        <button
          className={`nav-button ${location.pathname.includes("/adminview") ? "active" : ""}`}
          onClick={() => handleNavigation("/adminview?isadmin=true")}
        >
          Manage
        </button>
        <button
          className={`nav-button ${location.pathname.includes("/adminCalendar") ? "active" : ""}`}
          onClick={() => handleNavigation("/adminCalendar?isadmin=true")}
        >
          Calendar
        </button>
        <button
          className={`nav-button ${location.pathname.includes("/performance") ? "active" : ""}`}
          onClick={() => handleNavigation("/performance?isadmin=true")}
        >
          Scorecard
        </button>
      </div>
    </div>
  );
};

export default Navbar;
