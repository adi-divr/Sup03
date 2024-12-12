import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admincalendar.css";
import logo from "../../src/assets/logo.png";

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
  const handleNavigation = (route) => {
    navigate(route);
  };
  const renderCalendar = () => {
    const days = Array.from(
      { length: daysInMonth(currentMonth, currentYear) },
      (_, i) => i + 1
    );

    return days.map((day) => {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const slots = slotsData[date] || 0;

      return (
        <button
          key={day}
          className="calendar-day-new"
          onClick={() => handleDateClick(day)}
        >
          {day}
          <div className="slot-count-new">{slots > 0 ? slots : ""}</div>
        </button>
      );
    });
  };

  return (
    <div className="calendar-page-new">
      <div className="calendar-header-logo-new">
        <div className="logo-new">
          <img src={logo} alt="Logo" />
        </div>
        <div className="navbar-container">
        <div className="navbar">
        <button className="nav-button" onClick={() => handleNavigation("/?isadmin=true")}>
          Manage
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/adminCalendar?isadmin=true")}>
          Calendar
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/performance?isadmin=true")}>
          Scorecard
        </button>
        </div>
      </div>
        <h3>Slot Detailed Data</h3>
      </div>
      <div className="calendar-container-new">
        <div className="calendar-header-new">
          <div className="month-navigation-new">
            <button onClick={handlePreviousMonth}>&lt;</button>
            <span>
              {months[currentMonth]} {currentYear}
            </span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
        </div>
        <div className="calendar-grid-new">{renderCalendar()}</div>
      </div>
    </div>
  );
};

export default Calendar;
