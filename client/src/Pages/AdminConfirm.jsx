import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../src/assets/logo.png"; 
import "./adminconfirm.css";



const ConfirmAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const slotParam = searchParams.get("slot");

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
      paymentMade: (bookings.length * 1500).toString(),
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
    } catch (error) {
      console.error("Error rejecting booking:", error);
      alert("Failed to reject booking. Please try again.");
    }
  };



  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
        <div className="logo">
          <img src={logo} alt="Logo" width={150} height={150} />
        </div>
      </header>
      <main className="confirmation-main">
        <p className="confirmation-title">Confirmation Portal</p>
        <div className="slot-info">
          <span className="total-slots">
            Total Slots: <strong>{bookings.length}</strong>
          </span>
          <span className="date">{bookings[0]?.date || "N/A"}</span>
        </div>
        <div className="slot-list">
          {error ? (
            <p className="error">{error}</p>
          ) : bookings.length > 0 ? (
            <div className="slot-card">
              {bookings.map((slot, index) => (
                <div key={index} className="slot-details">
                  <div className="detail-item">
                    <strong>Name:</strong> {slot.name}
                  </div>
                  <div className="detail-item">
                    <strong>Weight:</strong>{" "}
                    <span
                      className={`weight ${
                        slot.weight === "above 100" ? "red-text" : "blue-text"
                      }`}
                    >
                      {slot.weight}
                    </span>
                  </div>
                  <div className="detail-item">
                    <strong>Age:</strong> {slot.age}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No bookings available.</p>
          )}
        </div>
        <div className="action-buttons">
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
