
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import logo from "../../src/assets/logo.png"; 
import "./confirmpage.css";

const Confirm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState([]);
  const [slotAndDate, setSlotAndDate] = useState({ slots: 0, selectedDate: "" });

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

      navigate(`/checkout?${price}`);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateParts = date.split("-");
    if (dateParts.length !== 3) return date; 
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="confirm-container">
       <div className="logo-Home-calendar">
          <img src={logo} alt="Logo-Home" width={150} height={150} />
        </div>
      <p className="checkout-title">CHECKOUT</p>
      <div className="summary-card">
        <h3>Booking Summary</h3>
        <p>
          <strong> Name: </strong>{firstName}
        </p>
        <p>
          <strong> Slots:</strong> {slots || 0}
        </p>
        <p>
          <strong> Date: </strong>{formatDate(selectedDate)}
        </p>
        <p>
          <strong> Amount:{" "}</strong>
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