import React, { useState, useEffect } from "react";
import "./dateblocker.css";

const DateBlocker = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [blockedDates, setBlockedDates] = useState([]);

  // Function to format date to DD/MM/YYYY
  const formatDate = (date) => {
    if (!date) return "N/A";
    const dateParts = date.split("-");
    if (dateParts.length !== 3) return date; // Return as-is if not a valid date
    const [year, month, day] = dateParts;
    return `${day}/${month}/${year}`;
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/GetBlockedDate`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch blocked dates");
      }

      const data = await response.json();
      console.log(data);
      setBlockedDates(data.data || []);
    } catch (error) {
      console.error("Error fetching blocked dates:", error);
      alert(error.message || "An unexpected error occurred.");
    }
  };

  useEffect(() => {
    fetchBlockedDates();
  }, []);

  // Function to convert DD/MM/YYYY to YYYY-MM-DD
  const formatDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    const payload = {
      fromDate: formatDateToISO(fromDate),
      toDate: formatDateToISO(toDate),
    };

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/BlockDate`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit data");
      }

      const data = await response.json();
      alert(data.message || "Dates submitted successfully!");
    } catch (error) {
      console.error("Error submitting data:", error);
      alert(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="block-date-container">
      <div className="block-date-wrapper">
        <h3 className="block-date-title">Blocking Date Selection</h3>
        <div className="block-date-inputs">
          <div className="block-date-group">
            <label className="block-date-label">Start date</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              className="block-date-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="block-date-group">
            <label className="block-date-label">End date</label>
            <input
              type="text"
              placeholder="DD/MM/YYYY"
              className="block-date-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <button className="block-date-submit" onClick={handleSubmit}>
          Submit
        </button>

        <h3 className="block-date-subtitle">Blocked Dates</h3>
        <ul className="blocked-dates-list">
          {blockedDates.map((date, index) => (
            <li key={index} className="blocked-date-item">
              {index + 1}. {formatDate(date.fromDate)} - {formatDate(date.toDate)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DateBlocker;
