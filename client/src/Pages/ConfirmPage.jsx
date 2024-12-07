import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import logo from "../../src/assets/logo.png"; // Adjust path as needed
import "./confirmpage.css";

const Confirm = () => {
  const navigate = useNavigate();

  // Local state for session data
  const [formData, setFormData] = useState([]);
  const [slotAndDate, setSlotAndDate] = useState({ slots: 0, selectedDate: "" });

  // Load data from sessionStorage
  useEffect(() => {
    const storedFormData = JSON.parse(sessionStorage.getItem("formData") || "[]");
    const storedSlotAndDate = JSON.parse(
      sessionStorage.getItem("slotAndDate") || '{"slots": 0, "selectedDate": ""}'
    );

    setFormData(storedFormData);
    setSlotAndDate(storedSlotAndDate);
  }, []);

  const firstName = formData[0]?.name || "N/A";
  const { slots, selectedDate } = slotAndDate;

  const calculatePrice = (slots) => slots * 1500;
  const price = calculatePrice(slots);

  const groupedData = formData.map((data, index) => ({
    ...data,
    slot: `slot${index + 1}`,
  }));

  const handleClick = async () => {
    const payload = {
      formData: groupedData,
      slotAndDate,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/submit`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log(data);

      navigate("/checkout");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="confirm-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" width={150} height={150} />
      </div>
      <h2 className="checkout-title">CHECKOUT</h2>
      <div className="summary-card">
        <h3>Booking Summary</h3>
        <p>
          <strong>Name:</strong> {firstName}
        </p>
        <p>
          <strong>Slots:</strong> {slots || 0}
        </p>
        <p>
          <strong>Date:</strong> {selectedDate || "N/A"}
        </p>
        <p>
          <strong>Amount:</strong>{" "}
          <span className="price">{price} INR</span>
        </p>
        <button className="confirm-btn" onClick={handleClick}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default Confirm;
