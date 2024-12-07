import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import logo from "../../src/assets/logo.png"
import "./calendar.css";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handleDateClick = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const formattedDate = date.toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
    navigate(`/slotbooking?selectedDate=${formattedDate}`);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11); // December
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0); // January
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const renderCalendar = () => {
    const days = Array.from(
      { length: daysInMonth(currentMonth, currentYear) },
      (_, i) => i + 1
    );

    return days.map((day) => (
      <button
        key={day}
        className="calendar-day"
        onClick={() => handleDateClick(day)}
      >
        {day}
      </button>
    ));
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header-logo">
        <div className="logo">
          <img src={logo} alt="Logo" width={150} height={150} />
        </div>
        <h3>When are you joining us?</h3>
      </div>
      <div className="calendar-container">
        <div className="calendar-header">
          <div className="month-navigation">
            <button onClick={handlePreviousMonth}>&lt;</button>
            <span>
              {months[currentMonth]} {currentYear}
            </span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
        </div>
        <div className="calendar-grid">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
