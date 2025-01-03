import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../src/assets/logo.png"; 
import "./adminconfirm.css";
import { useNavigate } from "react-router-dom"; 



const ConfirmAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const slotParam = searchParams.get("slot");
  const handleNavigation = (route) => {
    navigate(route);
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!slotParam) {
        setError("Slot parameter is missing.");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/GetFilteredData?slotKey=${encodeURIComponent(
            slotParam
          )}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
         
        const result = await response.json();
        console.log(result)
        if (result.data) {
          setBookings(
            result.data.slice(1).map((row) => ({
              name: row[0] || "N/A",
              weight: row[4] || "N/A",
              age: row[3] || "N/A",
              slot: row[5] || "N/A",
              number: row[2] || "N/A",
              date: row[7] || "N/A",
              status: row[8] || "N/A"
            }))
          );
        } else {
          setError("No data available.");
        }
      } catch (err) {
        setError(err.message || "An unexpected error occurred.");
      }
    };

    fetchData();
  }, [slotParam]);

  const handleAccept = async () => {
    if (!slotParam || bookings.length === 0) {
      alert("Slot parameter or bookings are missing.");
      return;
    }

    const bookingData = bookings.map((booking) => ({
      name: booking.name,
      number: booking.number,
      bookingDate: booking.date,
      slotID: slotParam,
      paymentMade: '1500',
    }));

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/Accepted`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }

      alert("Booking accepted and saved!");
      navigate(`/adminview?isadmin=true`)    //new change
      } catch (error) {
      console.error("Error submitting data:", error);
      alert("Failed to submit booking data. Please try again.");
    }
  };


  const handleReject = async () => {
    console.log("Rejecting bookings for slot:", slotParam);
  
    if (!slotParam) {
      alert("Slot parameter is missing.");
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/reject?slot=${encodeURIComponent(slotParam)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
        return;
      }
  
      alert(`Booking for slot ${slotParam} rejected successfully!`);
      navigate(`/adminview?isadmin=true`)    //new change

    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
  
    const dateParts = date.split("-");
    if (dateParts.length !== 3) return date; // Return as-is if not a valid date
  
    const [year, month, day] = dateParts;
  
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const monthIndex = parseInt(month, 10) - 1; 
    const monthName = months[monthIndex] || month; // Fallback to month number if invalid
  
    return `${monthName} ${day}`;
  };
  

  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
      <div className="logo-Home-admin">
        <img src={logo} alt="Logo-Home" width={150} height={150} />
      </div>
      <div className="navbar-container-admin">
        <div className="navbar-admin">
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
      </header>
      <main className="confirmation-main">
        <p className="confirmation-title">Confirmation Portal</p>
        
        <div className="slot-list">
          {error ? (
            <p className="error">{error}</p>
          ) : bookings.length > 0 ? (
            <div className="slot-card">
              <div className="slot-info">
          <span className="total-slots">
            Total Slots: <strong>{bookings.length}</strong>
          </span>
          <span className="date">{formatDate(bookings[0]?.date || "N/A")}</span>
        </div>
              {bookings.map((slot, index) => (
  <div key={index} className="slot-details">
    <div className="detail-item">
      Name: <strong>{slot.name}</strong>
    </div>
    <div className="detail-item">
      Weight:{" "}
      <span
        className={slot.weight === "yes" ? "blue-text" : "red-text"}
      >
        {slot.weight === "yes" ? "below 100" : "above 100"}
      </span>
    </div>
    <div className="detail-item">
      Age:{" "}
      <span
        className={slot.age === "yes" ? "blue-text" : "red-text"}
      >
        {slot.age === "yes" ? "above 18" : "below 18"}
      </span>
    </div>
  </div>
))}
            </div>
          ) : (
            <p>No bookings available.</p>
          )}
        </div>
        <div className="action-buttons-adminview">
          <button className="accept-button" onClick={handleAccept}>
            Accept
          </button>
          <button className="reject-button" onClick={handleReject}>
            Reject
          </button>
        </div>
      </main>
    </div>
  );
};
export default ConfirmAdmin;
