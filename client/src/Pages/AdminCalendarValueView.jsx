

import { useState, useEffect } from "react";
import logo from "../../src/assets/logo.png"; 
import "./admincalendarvalueview.css";
import { useNavigate } from "react-router-dom"; 
import Navbar from "./NavBar";


const AdminDataView = () => {
  const [totalSlots, setTotalSlots] = useState(0);
  const [details, setDetails] = useState([]);
  const getSelectedDate = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("date") || "";
  };
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(getSelectedDate());

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/api/GetCalendarValueView?date=${selectedDate}`
        );
        const data = await response.json();

        if (response.ok) {
          setTotalSlots(data.totalSlots || 0);
          setDetails(Array.isArray(data.details) ? data.details : []);
        } else {
          console.error("API Error:", data || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);
  const handleNavigation = (route) => {
    navigate(route);
  };
  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
      <div className="logo-Home-admin">
        <img src={logo} alt="Logo-Home" width={150} height={150} />
      </div>
      <Navbar/>
      </header>
      <main className="confirmation-main">
        <p className="portal-header">Slot Data</p>
        
        <div className="slot-list">
          {details && details.length > 0 ? (
            <div className="slot-card">
              <div className="portal-summary">
          <span className="total-slots">
            Total Slots: <strong>{totalSlots}</strong>
          </span>
          <span className="selected-date">
            {selectedDate
              ? new Date(selectedDate).toDateString()
              : "No date selected"}
          </span>
        </div>
              {details.map((detail, index) => (
                <div key={index} className="slot-details">
                  <div className="detail-item">
                  Name: {detail.name || "N/A"}
                  </div>
                  <div className="detail-item">
                    Phone: {detail.number || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-details">No details available for the selected date.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDataView;

