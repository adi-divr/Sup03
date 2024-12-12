// import { useState, useEffect } from "react";
// import "./admincalendarvalueview.css";


// const AdminDataView = () => {
//   const [totalSlots, setTotalSlots] = useState(0); 
//   const [details, setDetails] = useState([]); 

//   // Extract the "date" query parameter from the URL
//   const getSelectedDate = () => {
//     const params = new URLSearchParams(window.location.search);
//     return params.get("date") || ""; // Default to an empty string if not found
//   };

//   const [selectedDate, setSelectedDate] = useState(getSelectedDate());

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!selectedDate) return;

//       try {
//         const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/GetCalendarValueView?date=${selectedDate}`);//{process.env.REACT_APP
//         const data = await response.json();

//         if (response.ok) {
//           setTotalSlots(data.totalSlots || 0); 
//           setDetails(Array.isArray(data.details) ? data.details : []); 
//         } else {
//           console.error("API Error:", data || "Unknown error");
//         }
//       } catch (error) {
//         console.error("Error fetching API data:", error);
//       }
//     };

//     fetchData();
//   }, [selectedDate]);

//   return (
//     <div className="confirmation-portal">
//       <h1 className="portal-header">Slot Names</h1>
//       <div className="portal-summary">
//         <span className="total-slots">
//           Total Slots: <strong>{totalSlots}</strong>
//         </span>
//         <span className="selected-date">
//           {selectedDate ? new Date(selectedDate).toDateString() : "No date selected"}
//         </span>
//       </div>
//       <div className="portal-details">
//         {details && details.length > 0 ? (
//           details.map((detail, index) => (
//             <div key={index} className="detail-card">
//               <p className="detail-name">
//                 <strong>Name:</strong> {detail.name}
//               </p>
//               <p className="detail-phone">
//                 <strong>Phone:</strong> {detail.number}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="no-details">No details available for the selected date.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDataView;

import { useState, useEffect } from "react";
import logo from "../../src/assets/logo.png"; 
import "./admincalendarvalueview.css";

const AdminDataView = () => {
  const [totalSlots, setTotalSlots] = useState(0);
  const [details, setDetails] = useState([]);
  const getSelectedDate = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("date") || "";
  };

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

  return (
    <div className="confirmation-container">
      <header className="confirmation-header">
        <div className="logo">
          <img src={logo} alt="Logo" width={150} height={150} />
        </div>
      </header>
      <main className="confirmation-main">
        <h1 className="portal-header">Slot Data</h1>
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
        <div className="slot-list">
          {details && details.length > 0 ? (
            <div className="slot-card">
              {details.map((detail, index) => (
                <div key={index} className="slot-details">
                  <div className="detail-item">
                    <strong>Name:</strong> {detail.name || "N/A"}
                  </div>
                  <div className="detail-item">
                    <strong>Phone:</strong> {detail.number || "N/A"}
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

