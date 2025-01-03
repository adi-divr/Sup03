import React, { useEffect, useState } from "react";
import "./adminview.css";
import logo from "../../src/assets/logo.png";
import nextButton from "../../src/assets/next.png"; 
import { useNavigate } from "react-router-dom"; 
import Navbar from "./NavBar";

const AdminView = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/GetData`);
        const text = await response.text(); // Log raw response
  
        if (!response.ok) {
          throw new Error(`No Data: ${response.status}`);
        }
  
        const result = JSON.parse(text); 
  
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

 
//adminview > admin confirm
//adminview can go to admincalendar


const formatDate = (date) => {
  if (!date) return "N/A";

  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) return date;

    const options = { month: "short", day: "2-digit", year: "2-digit" };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    const formattedDate = formatter.format(parsedDate);

    return formattedDate.replace(", ", "/");
  } catch {
    return date; 
  }
};





 console.log(bookings)

  return (

    
    <div className="admin-container">

<div className="logo-Home-admin">
        <img src={logo} alt="Logo-Home" width={150} height={150} />
      </div>

      <Navbar/>

      <p style={{marginBottom:'40px'}}>Manage Bookings</p>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="booking-list">
          {bookings.map((booking, index) => (
            <div className="booking-card" key={index}>
              <div className="card-header">
                {/* <span>Total Slots: {booking.slot}</span> */}
                <span>{formatDate(booking.bookingDate)}</span>
              </div>
              <div className="card-details">
                <p>
                  <strong>{booking.name}</strong>
                </p>
                <p>
                   {booking.phone}
                </p>
                <p>
                  {booking.email}
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
