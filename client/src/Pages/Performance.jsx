
import React, { useState, useEffect } from 'react';
import './performance.css';
import { useNavigate } from "react-router-dom";
import logo from "../../src/assets/logo.png"; 
import Navbar from './NavBar';


const PerformancePage = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1); 
  const [year, setYear] = useState(new Date().getFullYear()); 
  const [weeklyData, setWeeklyData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Performance?month=${month}&year=${year}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.acceptedSlots && data.rejectedSlots && data.payments) {
          const formattedData = data.acceptedSlots.map((slots, index) => ({
            week: `WEEK ${index + 1}`,
            acceptedSlots: slots,
            rejected: data.rejectedSlots[index] || 0, 
            totalRevenue: data.payments[index] || 0,
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
      <div className="logo-Home-admin">
        <img src={logo} alt="Logo-Home" width={150} height={150} />
      </div>

      
      <Navbar/>
      <p style={{marginBottom:"40px",marginTop:"40px", color:"white"}}>Weekly Scorecard</p>
      <div className="month-selector-container">
        <div className="month-selector">
          <button onClick={handlePrevMonth}>&lt;</button>
          <span style={{color:'black'}}>{monthNames[month - 1]} <span style={{color:'blue'}}>{year}</span></span>
          <button onClick={handleNextMonth}>&gt;</button>
        </div>
      </div>
      <div className="weekly-data">
        {weeklyData.map((week) => (
          <div className="week-card" key={week.week}>
            <h5>{week.week}</h5>
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


