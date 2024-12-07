import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // React Router for routing
import logo from "../../src/assets/logo.png"; // Adjust the path as needed
import "./slotbooking.css";

const Slotbooking = () => {
  const location = useLocation(); // For accessing query parameters
  const navigate = useNavigate(); // For navigation
  const queryParams = new URLSearchParams(location.search); // Parse query parameters
  const selectedDate = queryParams.get("selectedDate");

  const [slots, setSlots] = useState(0);

  const handleIncrement = () => setSlots(slots + 1);
  const handleDecrement = () => setSlots(slots > 0 ? slots - 1 : 0);

  const handleSubmit = () => {
    console.log(`Date: ${selectedDate}, Slots: ${slots}`);
    navigate(`/slotform?selectedDate=${selectedDate}&slots=${slots}`); // Navigate to the slot form
  };

  return (
    <div className="container">
      <div className="header">
        <img src={logo} alt="Logo" width={150} height={150} /> {/* Standard img tag */}
        <h2>SLOTS</h2>
      </div>
      <div className="card">
        <div className="row">
          <span>Date selected</span>
          <span>{selectedDate || "No date selected"}</span>
        </div>
        <div className="row">
          <span>No. of slots</span>
          <div className="counter">
            <button onClick={handleDecrement}>&#9660;</button>
            <span>{slots}</span>
            <button onClick={handleIncrement}>&#9650;</button>
          </div>
        </div>
        <button className="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Slotbooking;
