
import React, { useState, useEffect } from "react";
import "./admincalendar.css";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";
import Navbar from "./NavBar";

const months = [
  "",
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
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [slotsData, setSlotsData] = useState({});
  const navigate = useNavigate();

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    const fetchSlotsData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/GetCalendarValue?month=${currentMonth + 1}&year=${currentYear}`
        );
        const data = await response.json();
        if (response.ok) {
          setSlotsData(data.slots || {});
        } else {
          console.error("Failed to fetch slots:", data.message);
        }
      } catch (error) {
        console.error("Error fetching slots data:", error);
      }
    };

    fetchSlotsData();
  }, [currentMonth, currentYear]);

  const handleDateClick = (day) => {
    const formattedDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    navigate(`/admincalendarvalueview?date=${formattedDate}&isadmin=true`);
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prevYear) => prevYear - 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prevYear) => prevYear + 1);
    } else {
      setCurrentMonth((prevMonth) => prevMonth + 1);
    }
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const handleblock = () => {
    navigate(`/blockdate?isadmin=true`);
  };

  const renderDayCells = () => {
    const days = Array.from(
      { length: daysInMonth(currentMonth, currentYear) },
      (_, i) => i + 1
    );

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const blankCells = Array.from({ length: firstDay }, (_, i) => (
      <div key={`blank-${i}`} className="calendar-cell-blank"></div>
    ));

    const dayCells = days.map((day) => {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const slots = slotsData[date] || 0;

      return (
        <div
          key={day}
          className={`calendar-cell ${
            new Date().getDate() === day &&
            currentMonth === new Date().getMonth() &&
            currentYear === new Date().getFullYear()
              ? "calendar-today"
              : ""
          }`}
          onClick={() => handleDateClick(day)}
        >
          <span className="calendar-day-num">{day}</span>
          {slots > 0 && <span className="calendar-day-number">{slots}</span>}
        </div>
      );
    });

    return [...blankCells, ...dayCells];
  };

  return (
    
    <div className="calendar-container">
      <div className="logo-Home-admin-calendar">
        <img src={logo} alt="Logo-Home" width={150} height={150} />
      </div>
      <Navbar/>

      <div className="calendar-header">
        
        <div className="calendar-schedule-text">Schedule</div>
      </div>

      <div className="month-display">
  <button type="button" onClick={handleblock} className="button-to-left">
    <i className="fas fa-cog"></i>
  </button>
  <span className="selected-date">
    {new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })}
  </span>
</div>

<div className="monthandbuttons">
  <button className="calendar-nav-button" onClick={handlePreviousMonth}>
    &lt;
  </button>
  <div className="calendar-month-year">
    <span className="calendar-month">{months[currentMonth + 1]}</span>
  </div>
  <button className="calendar-nav-button" onClick={handleNextMonth}>
    &gt;
  </button>
</div>

      <div className="calendar-weekdays">
        {weekdays.map((day) => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-days">{renderDayCells()}</div>
    </div>
  );
};

export default Calendar;
