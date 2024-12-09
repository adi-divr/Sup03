import React, { useEffect, useState } from "react";
import "./adminview.css";
import logo from "../../src/assets/logo.png"; // Update the path as per your project structure
import nextButton from "../../src/assets/next.png"; // Update the path as per your project structure
import { useNavigate } from "react-router-dom"; // For navigation in React
const API_BASE_URL ="https://a0e4-2406-7400-bd-f8e9-102f-dd26-6dea-8ecc.ngrok-free.app"


const AdminView = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/GetData`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        const rows = result.data;

        const formattedData = rows.slice(1).map((row) => ({
          name: row[0] || "",
          email: row[1] || "",
          phone: row[2] || "",
          slot: row[5] || "",
          ddmm: row[6] || "",
          bookingDate: row[7] || "",
        }));

        setBookings(formattedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchData();
  }, []);

  const handleNextClick = (name, slot, date) => {
    navigate(
      `/adminConfirm?isadmin=true&name=${encodeURIComponent(name)}&slot=${encodeURIComponent(slot)}&bookingdate=${encodeURIComponent(
        date
      )}`
    );
  };

  const handleNavigation = (route) => {
    navigate(route);
  };
//adminview > admin confirm
//adminview can go to admincalendar
  return (
    <div className="admin-container">
      <div className="navbar-container">
        <div className="navbar">
        <button className="nav-button" onClick={() => handleNavigation("/?isadmin=true")}>
          Manage
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/adminCalendar?isadmin=true")}>
          Calendar
        </button>
        <button className="nav-button" onClick={() => handleNavigation("/performance?isadmin=true")}>
          Performance
        </button>
        </div>
      </div>

      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <h2>Manage Bookings</h2>
      </div>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking, index) => (
            <div className="booking-card" key={index}>
              <div className="card-header">
                <span>Total Slots: {booking.slot}</span>
                <span>{booking.bookingDate}</span>
              </div>
              <div className="card-details">
                <p>
                  <strong>{booking.name}</strong>
                </p>
                <p>
                  <i className="fa fa-phone"></i> {booking.phone}
                </p>
                <p>
                  <i className="fa fa-envelope"></i> {booking.email}
                </p>
              </div>
              <button
                className="next-button"
                onClick={() => handleNextClick(booking.name, booking.slot, booking.bookingDate)}
              >
                <img src={nextButton} alt="Next" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminView;
