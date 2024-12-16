// import React, { useState, useEffect } from 'react';
// import './performance.css';
 import logo from "../../src/assets/logo.png";
// import { useNavigate } from "react-router-dom";



// const PerformancePage = () => {
//   const [data, setData] = useState({
//     acceptedSlots: 0,
//     totalPayment: 0,
//   });
//   const [month, setMonth] = useState(new Date().getMonth() + 1);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const navigate = useNavigate();

//   const fetchMonthlyDetails = async () => {
//     try {
//       const response = await fetch(
//         `${process.env.REACT_APP_API_BASE_URL}/api/Performance?month=${month}&year=${year}`
//       );
//       const result = await response.json();
//       setData({
//         acceptedSlots: result.totalSlots || 0,
//         totalPayment: result.totalPayment || 0,
//       });
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const handleMonthChange = (direction) => {
//     let newMonth = month + direction;
//     let newYear = year;

//     if (newMonth > 12) {
//       newMonth = 1;
//       newYear++;
//     } else if (newMonth < 1) {
//       newMonth = 12;
//       newYear--;
//     }

//     setMonth(newMonth);
//     setYear(newYear);
//   };

//   useEffect(() => {
//     fetchMonthlyDetails();
//   }, [month, year]);
//   const handleNavigation = (route) => {
//     navigate(route);
//   };
//   return (
//     <div className="performance-page">
//       <div className="logo-new">
//           <img src={logo} alt="Logo" />
//         </div>
//       <div className="navbar-container">
//         <div className="navbar">
//         <button className="nav-button" onClick={() => handleNavigation("/?isadmin=true")}>
//           Manage
//         </button>
//         <button className="nav-button" onClick={() => handleNavigation("/adminCalendar?isadmin=true")}>
//           Calendar
//         </button>
//         <button className="nav-button" onClick={() => handleNavigation("/performance?isadmin=true")}>
//           Scorecard
//         </button>
//         </div>
//       </div>
//       <h2 className="section-title">WEEKLY SCORECARD</h2>
//       <div className="scorecard">
//         <div className="month-navigation">
//           <button onClick={() => handleMonthChange(-1)}>&lt;</button>
//           <div className="month-year">
//             {new Date(year, month - 1).toLocaleString('default', {
//               month: 'long',
//             })}{' '}
//             {year}
//           </div>
//           <button onClick={() => handleMonthChange(1)}>&gt;</button>
//         </div>
//         <div className="stats">
//           <div>
//             <span className="label">Accepted Slots: </span>
//             <span className="value accepted">{data.acceptedSlots}</span>
//           </div>
//           <div>
//             <span className="label">Total Revenue: </span>
//             <span className="value revenue">{data.totalPayment}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PerformancePage;

// WeeklyScorecard.jsx
import React, { useState, useEffect } from 'react';
import './performance.css';
import { useNavigate } from "react-router-dom";

const PerformancePage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Current month
  const [year, setYear] = useState(new Date().getFullYear()); // Current year
  const [weeklyData, setWeeklyData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Performance?month=${month}&year=${year}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.acceptedSlots && data.payments) {
          const formattedData = data.acceptedSlots.map((slots, index) => ({
            week: `WEEK ${index + 1}`,
            acceptedSlots: slots,
            rejected: "N/A", // Rejected slots set to N/A
            totalRevenue: data.payments[index],
          }));
          setWeeklyData(formattedData);
        }
      })
      .catch((error) => console.error('Error fetching weekly data:', error));
  }, [month, year]);

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handleNavigation = (route) => {
    navigate(route);
  };

  return (
    <div className="weekly-scorecard">
      <div className="logo-container">
        <img src={logo} alt="Logo" width={150} height={150} />
      </div>
      <div className="navbar-container">
        <div className="navbar">
          <button className="nav-button" onClick={() => handleNavigation("/adminview?isadmin=true")}>
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
      <h2>Weekly Scorecard</h2>
      <div className="month-selector-container">
        <div className="month-selector">
          <button onClick={handlePrevMonth}>&lt;</button>
          <span>{monthNames[month - 1]} {year}</span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
      </div>
      <div className="weekly-data">
        {weeklyData.map((week) => (
          <div className="week-card" key={week.week}>
            <h3>{week.week}</h3>
            <div className="card-content">
              <p><span>Accepted Slots:</span> <span className="value accepted">{week.acceptedSlots}</span></p>
              <p><span>Rejected Slots:</span> <span className="value rejected">{week.rejected}</span></p>
              <p><span>Total Revenue:</span> <span className="value revenue">{week.totalRevenue}</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default PerformancePage;


