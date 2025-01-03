
import React, { useState, useEffect } from "react";
import "./calendar.css";
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png";

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
const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

const Calendar = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(
    `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [highlightedDates, setHighlightedDates] = useState([]);
  const navigate = useNavigate();

  const fetchData = async (month, year) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/GetSlots?month=${month}&year=${year}`
      );
      const text = await response.text();

      if (!response.ok) {
        throw new Error(`No Data: ${response.status}`);
      }

      const result = JSON.parse(text);
      const slots = result.availableSlots.map(([date, number]) => ({
        date,
        number,
      }));
      setAvailableSlots(slots);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const fetchDatesInRange = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/GetDatesInRange`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch dates: ${response.status}`);
      }
      const data = await response.json();
      const datesArray = Array.isArray(data.dates) ? data.dates : [];
      setHighlightedDates(datesArray);
    } catch (error) {
      console.error("Error fetching dates in range:", error);
      setHighlightedDates([]);
    }
  };

  useEffect(() => {
    fetchData(month, year);
    fetchDatesInRange();
  }, [month, year]);

  const handleDayClick = (id) => {
    if (!id.startsWith("blank")) {
      const day = id.slice(0, 2);
      const month = id.slice(2, 4);
      const year = id.slice(4);

      const formattedDate = `${year}-${month}-${day}`;
      const selectedDate = new Date(`${year}-${month}-${day}`);

      if (selectedDate > today) {
        setSelectedDay(id);
        navigate(`/slotbooking?selectedDate=${formattedDate}`);
      }
    }
  };

  const handleMonthChange = (dir) => {
    if (dir === "left") {
      if (year > today.getFullYear() || (year === today.getFullYear() && month > today.getMonth() + 1)) {
        setMonth((prevMonth) => (prevMonth === 1 ? 12 : prevMonth - 1));
        if (month === 1) setYear((prevYear) => prevYear - 1);
      }
    } else {
      setMonth((prevMonth) => (prevMonth === 12 ? 1 : prevMonth + 1));
      if (month === 12) setYear((prevYear) => prevYear + 1);
    }
  };

  const renderDayCells = () => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const rows = [];
  
    for (let i = 0; i < firstDay; i++) {
      rows.push({ key: `blank${i}`, className: "cell-blank", dayNum: "" });
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      const key = `${String(day).padStart(2, "0")}${String(month).padStart(
        2,
        "0"
      )}${year}`;
      const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
  
      const isHighlighted = highlightedDates.includes(formattedDate);
      const slot = availableSlots.find((slot) => slot.date === formattedDate);
      const dateObj = new Date(formattedDate);
  
      const isDisabled =
        dateObj <= today || isHighlighted || (slot && slot.number === 0);  //added new logic, where less than 0 is blocked too
  
      rows.push({
        key,
        className: `cell ${
          isHighlighted ? "highlighted" : ""        /////////////////////////highlighted
        } ${isDisabled ? "disabled" : ""}`,
        dayNum: day,
        number: isHighlighted ? "" : slot ? slot.number : 12,
        clickable: !isDisabled,
      });
    }
  
    return rows.map((item) => (
      <div
        key={item.key}
        className={item.className}
        onClick={item.clickable ? () => handleDayClick(item.key) : null}
        style={{ pointerEvents: item.clickable ? "auto" : "none" }}
      >
        <span
          className={`dayNum ${
            item.key === selectedDay && !item.key.startsWith("blank") //////////////////////////selected
              ? "selected"
              : ""
          }`}
        >
          {item.dayNum}
        </span>
        {item.dayNum && <span className="dayNumber">{item.number}</span>}
      </div>
    ));
  };

  return (
    <div className="calendarContainer">
     <div className="logo-Home-calendar">
        <img src={logo} alt="Logo-Home" width={150} height={150} />
      </div>
        <p>When are you joining us?</p>
      <div className="monthYearTitleContainer">
        <button
          className="monthChangeButton"
          onClick={() => handleMonthChange("left")}
        >
          &lt;
        </button>
        <div className="monthYearWrap">
          <div className="monthWrap">{months[month]}</div>
          <div className="yearWrap">{year}</div>
        </div>
        <button
          className="monthChangeButton"
          onClick={() => handleMonthChange("right")}
        >
          &gt;
        </button>
      </div>
      <div className="weekdayTitleContainer">
        {weekdays.map((day) => (
          <div key={day} className="weekWrap">
            {day}
          </div>
        ))}
      </div>
      <div className="calendarsWrap">
        <div className="dayCellsContainer">{renderDayCells()}</div>
      </div>
    </div>
  );
};

export default Calendar;
