// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import logo from "../../src/assets/logo.png";
// import "./calendar.css";

// const Calendar = () => {
//   const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
//   const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
//   const navigate = useNavigate();

//   const daysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const handleDateClick = (day) => {
//     const date = new Date(currentYear, currentMonth, day);
//     const formattedDate = date.toLocaleDateString("en-CA");
//     navigate(`/slotbooking?selectedDate=${formattedDate}`);
//   };

//   const handlePreviousMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);
//       setCurrentYear((prevYear) => prevYear - 1);
//     } else {
//       setCurrentMonth((prevMonth) => prevMonth - 1);
//     }
//   };

//   const handleNextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear((prevYear) => prevYear + 1);
//     } else {
//       setCurrentMonth((prevMonth) => prevMonth + 1);
//     }
//   };

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const renderCalendar = () => {
//     const days = Array.from(
//       { length: daysInMonth(currentMonth, currentYear) },
//       (_, i) => i + 1
//     );

//     return days.map((day) => (
//       <button
//         key={day}
//         className="calendar-day"
//         onClick={() => handleDateClick(day)}
//       >
//         {day}
//       </button>
//     ));
//   };

//   return (
//     <div className="calendar-page">
//       <div className="calendar-header-logo">
//         <div className="logo">
//           <img src={logo} alt="Logo" width={150} height={150} />
//         </div>
//         <h3>When are you joining us?</h3>
//       </div>
//       <div className="calendar-container">
//         <div className="calendar-header">
//           <div className="month-navigation">
//             <button onClick={handlePreviousMonth}>&lt;</button>
//             <span>
//               {months[currentMonth]} {currentYear}
//             </span>
//             <button onClick={handleNextMonth}>&gt;</button>
//           </div>
//         </div>
//         <div className="calendar-grid">{renderCalendar()}</div>
//       </div>
//     </div>
//   );
// };

// export default Calendar;


// import React, { useState,useEffect } from "react";
// import "./calendar.css"; 
// import { useNavigate } from "react-router-dom";


// const months = [
//   "",
//   "January",
//   "February",
//   "March",
//   "April",
//   "May",
//   "June",
//   "July",
//   "August",
//   "September",
//   "October",
//   "November",
//   "December",
// ];
// const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// const Calendar = () => {
//   const today = new Date();
//   const [month, setMonth] = useState(today.getMonth() + 1);
//   const [year, setYear] = useState(today.getFullYear());
//   const [selectedDay, setSelectedDay] = useState(
//     `${today.getDate()}${today.getMonth() + 1}${today.getFullYear()}`
//   );
//   const navigate = useNavigate();

//  useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/GetSlots`);
//         const text = await response.text(); // Log raw response
  
//         if (!response.ok) {
//           throw new Error(`No Data: ${response.status}`);
//         }
  
//         const result = JSON.parse(text); 
  
//         const rows = result.data;
//         console.log("Parsed Data:", rows);

       
  
        
//       } catch (err) {
//         console.error("Error fetching data:", err);
//       }
//     };
  
//     fetchData();
//   }, []);

  
//   const handleDayClick = (id) => {
//     if (!id.startsWith("blank")) {
//       const day = id.slice(0, 2); 
//       const month = id.slice(2, 4); 
//       const year = id.slice(4); 
  
//       // Format the date as YYYY-MM-DD
//       const formattedDate = `${year}-${month}-${day}`;
  
//       setSelectedDay(id);
//       console.log(`Selected ID: ${id}, Formatted Date: ${formattedDate}`);
//       navigate(`/slotbooking?selectedDate=${formattedDate}`);
//     }
//   };

//   const handleMonthChange = (dir) => {
//     if (dir === "left") {
//       setMonth((prevMonth) => (prevMonth === 1 ? 12 : prevMonth - 1));
//       if (month === 1) setYear((prevYear) => prevYear - 1);
//     } else {
//       setMonth((prevMonth) => (prevMonth === 12 ? 1 : prevMonth + 1));
//       if (month === 12) setYear((prevYear) => prevYear + 1);
//     }
//   };

//   const renderDayCells = () => {
//     const daysInMonth = new Date(year, month, 0).getDate();
//     const firstDay = new Date(year, month - 1, 1).getDay();
//     const rows = [];
  
//     for (let i = 0; i < firstDay; i++) {
//       rows.push({ key: `blank${i}`, className: "cell-blank", dayNum: "" });
//     }
  
//     for (let day = 1; day <= daysInMonth; day++) {
//       rows.push({
//         key: `${String(day).padStart(2, "0")}${String(month).padStart(2, "0")}${year}`,
//         className: "cell",
//         dayNum: day,
//         number: 144, // Default number
//       });
//     }
  
//     return rows.map((item) => (
//       <div
//         key={item.key}
//         className={item.className}
//         onClick={() => handleDayClick(item.key)}
//       >
//         <span
//           className={`dayNum ${
//             item.key === selectedDay && !item.key.startsWith("blank")
//               ? "selected"
//               : ""
//           }`}
//         >
//           {item.dayNum}
//         </span>
//         {item.dayNum && (
//           <span className="dayNumber">
//             {item.number}
//           </span>
//         )}
//       </div>
//     ));
//   };

//   return (
//     <div className="calendarContainer">
//       <div className="monthYearTitleContainer">
//         <button
//           className="monthChangeButton"
//           onClick={() => handleMonthChange("left")}
//         >
//           &lt;
//         </button>
//         <div className="monthYearWrap">
//           <div className="monthWrap">{months[month]}</div>
//           <div className="yearWrap">{year}</div>
//         </div>
//         <button
//           className="monthChangeButton"
//           onClick={() => handleMonthChange("right")}
//         >
//           &gt;
//         </button>
//       </div>
//       <div className="weekdayTitleContainer">
//         {weekdays.map((day) => (
//           <div key={day} className="weekWrap">
//             {day}
//           </div>
//         ))}
//       </div>
//       <div className="calendarsWrap">
//         <div className="dayCellsContainer">{renderDayCells()}</div>
//       </div>
//     </div>
//   );
// };

// export default Calendar; //working def 12 code
import React, { useState, useEffect } from "react";
import "./calendar.css";
import { useNavigate } from "react-router-dom";

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
        dateObj <= today || isHighlighted; // Disable past dates and highlighted dates
  
      rows.push({
        key,
        className: `cell ${
          isHighlighted ? "highlighted" : ""
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
            item.key === selectedDay && !item.key.startsWith("blank")
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
