import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import logo from "../../src/assets/logo.png"; // Adjust the path if necessary
import "./adminconfirm.css";
const API_BASE_URL ="https://9cd7-2406-7400-bd-f8e9-102f-dd26-6dea-8ecc.ngrok-free.app"



const ConfirmAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();

  // Extract the `slot` parameter from the URL
  const searchParams = new URLSearchParams(location.search);
  const slotParam = searchParams.get("slot");

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!slotParam) {
        setError("Slot parameter is missing.");
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/GetFilteredData?slotKey=${encodeURIComponent(slotParam)}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const result = await response.json();
        if (result.data) {
          setBookings(
            result.data.slice(1).map((row) => ({
              name: row[0] || "N/A",
              weight: row[3] || "N/A",
              age: row[4] || "N/A",
              slot: row[5] || "N/A",
              number: row[2] || "N/A",
              date: row[7] || "N/A",
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
      const response = await fetch(`${API_BASE_URL}/api/Accepted`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

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
    console.log('hi')
  };

  const handleReject = () => {
    console.log("Rejected bookings for slot:", slotParam);
  };

  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
        <img src={logo} alt="SUP IN KOCHI Logo" className="logo" />
      </header>
      <main className="confirmation-main">
        <h1 className="confirmation-title">Confirmation Portal</h1>
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
            bookings.map((slot, index) => (
              <div key={index} className="slot-card">
                <p>
                  <strong>Name:</strong> {slot.name}
                </p>
                <p>
                  <strong>Weight:</strong>{" "}
                  <span
                    className={`weight ${
                      slot.weight === "above 100" ? "red-text" : "blue-text"
                    }`}
                  >
                    {slot.weight}
                  </span>
                </p>
                <p>
                  <strong>Age:</strong> <span>{slot.age}</span>
                </p>
              </div>
            ))
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
