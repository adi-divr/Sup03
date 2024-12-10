import { useState, useEffect } from "react";
import "./admincalendarvalueview.css";
const API_BASE_URL ="https://9f7a-2406-7400-bd-f8e9-4ae-8774-746a-966.ngrok-free.app"


const AdminDataView = () => {
  const [totalSlots, setTotalSlots] = useState(0); // Initialize totalSlots as 0
  const [details, setDetails] = useState([]); // Initialize details as an empty array

  // Extract the "date" query parameter from the URL
  const getSelectedDate = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("date") || ""; // Default to an empty string if not found
  };

  const [selectedDate, setSelectedDate] = useState(getSelectedDate());

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedDate) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/GetCalendarValueView?date=${selectedDate}`);//{process.env.REACT_APP
        const data = await response.json();

        if (response.ok) {
          setTotalSlots(data.totalSlots || 0); // Ensure totalSlots is always a number
          setDetails(Array.isArray(data.details) ? data.details : []); // Ensure details is always an array
        } else {
          console.error("API Error:", data || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    };

    fetchData();
  }, [selectedDate]);

  return (
    <div className="confirmation-portal">
      <h1 className="portal-header">Slot Names</h1>
      <div className="portal-summary">
        <span className="total-slots">
          Total Slots: <strong>{totalSlots}</strong>
        </span>
        <span className="selected-date">
          {selectedDate ? new Date(selectedDate).toDateString() : "No date selected"}
        </span>
      </div>
      <div className="portal-details">
        {details && details.length > 0 ? (
          details.map((detail, index) => (
            <div key={index} className="detail-card">
              <p className="detail-name">
                <strong>Name:</strong> {detail.name}
              </p>
              <p className="detail-phone">
                <strong>Phone:</strong> {detail.number}
              </p>
            </div>
          ))
        ) : (
          <p className="no-details">No details available for the selected date.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDataView;
