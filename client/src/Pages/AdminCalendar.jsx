import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // React Router for navigation
import "./admincalendar.css";
import logo from "../../src/assets/logo.png"; // Adjust path based on your structure
const API_BASE_URL =" https://51b8-2406-7400-bd-f8e9-102f-dd26-6dea-8ecc.ngrok-free.app"


const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [slotsData, setSlotsData] = useState({}); // Store slots for each date
  const navigate = useNavigate(); // React Router navigation hook

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate(); // Returns the last day of the month
  };

  // Fetch slots data from the server  
  useEffect(() => {
    const fetchSlotsData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/GetCalendarValue?month=${currentMonth + 1}&year=${currentYear}`);
        const data = await response.json();
        if (response.ok) {
          setSlotsData(data.slots); // Expected format: { "2024-12-05": 18, "2024-12-06": 10 }
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
    //navigate(`/adminCalendarView?date=${formattedDate}`); // Navigate to the target route
    navigate(`/admincalendarvalueview?date=${formattedDate}&isadmin=true`);
    console.log('hi')  
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

    return days.map((day) => {
      const date = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const slots = slotsData[date] || 0;

      return (
        <button
          key={day}
          className="calendar-day-new"
          onClick={() => handleDateClick(day)}
          style={{ background: "white" }}
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
          <img src={logo} alt="Logo" width={150} height={150} />
        </div>
        <h3>When are you joining us?</h3>
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
