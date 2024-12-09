import React, { useState, useEffect } from 'react';
import './performance.css';
import logo from "../../src/assets/logo.png";

const PerformancePage = () => {
  const [data, setData] = useState({
    acceptedSlots: 0,
    totalPayment: 0,
  });
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchMonthlyDetails = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/Performance?month=${month}&year=${year}`
      );
      const result = await response.json();
      setData({
        acceptedSlots: result.totalSlots || 0,
        totalPayment: result.totalPayment || 0,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleMonthChange = (direction) => {
    let newMonth = month + direction;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear++;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear--;
    }

    setMonth(newMonth);
    setYear(newYear);
  };

  useEffect(() => {
    fetchMonthlyDetails();
  }, [month, year]);

  return (
    <div className="performance-page">
      <header className="header">
        <img src={logo} alt="Logo" className="logo" />
      </header>
      {/* <div className="tabs">
        <button className="tab">Manage</button>
        <button className="tab">Calendar</button>
        <button className="tab active">Performance</button>
      </div> */}
      <h2 className="section-title">WEEKLY SCORECARD</h2>
      <div className="scorecard">
        <div className="month-navigation">
          <button onClick={() => handleMonthChange(-1)}>&lt;</button>
          <div className="month-year">
            {new Date(year, month - 1).toLocaleString('default', {
              month: 'long',
            })}{' '}
            {year}
          </div>
          <button onClick={() => handleMonthChange(1)}>&gt;</button>
        </div>
        <div className="stats">
          <div>
            <span className="label">Accepted Slots: </span>
            <span className="value accepted">{data.acceptedSlots}</span>
          </div>
          <div>
            <span className="label">Total Revenue: </span>
            <span className="value revenue">{data.totalPayment}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage;
