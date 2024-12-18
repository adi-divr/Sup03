import React, { useEffect, useState } from "react";
import "./adminview.css";
import logo from "../../src/assets/logo.png";
import nextButton from "../../src/assets/next.png"; 
import { useNavigate } from "react-router-dom"; 


const AdminView = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(`${API_BASE_URL}/api/GetData`);
  //       console.log(response.status);

  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       const result = await response.json();
  //       const rows = result.data;

  //       const formattedData = rows.slice(1).map((row) => ({
  //         name: row[0] || "",
  //         email: row[1] || "",
  //         phone: row[2] || "",
  //         slot: row[5] || "",
  //         ddmm: row[6] || "",
  //         bookingDate: row[7] || "",
  //       }));

  //       setBookings(formattedData);
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setError(err.message);
  //       } else {
  //         setError("An unknown error occurred");
  //       }
  //     }
  //   };

  //   fetchData();
  // }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/GetData`);
        console.log("Response Status:", response.status);
        const text = await response.text(); // Log raw response
        console.log("Raw Response:", text);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
  
        const result = JSON.parse(text); 
        console.log("Parsed Data:", result);
  
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
        console.error("Error fetching data:", err);
        setError(err.message || "An unknown error occurred");
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

<div className="logo">
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

      <p>Manage Bookings</p>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking, index) => (
            <div className="booking-card" key={index}>
              <div className="card-header">
                {/* <span>Total Slots: {booking.slot}</span> */}
                <span>Slot Date: {booking.bookingDate}</span>
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
