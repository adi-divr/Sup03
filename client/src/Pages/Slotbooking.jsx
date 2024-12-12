import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png"; // Adjust the path as needed
import "./slotbooking.css";



const Slotbooking = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const queryParams = new URLSearchParams(location.search); // Parse 
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
      <div className="logo">
          <img src={logo} alt="Logo" width={150} height={150} />
        </div>
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
        <button className="submit" onClick={handleSubmit} disabled={slots < 1 || slots > 12}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default Slotbooking;
