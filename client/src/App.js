import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import Calendar from "./Pages/Calendar";
import Slotbooking from "./Pages/Slotbooking";
import Slotform from "./Pages/Slotform";
import Confirm from "./Pages/ConfirmPage";
import Checkout from "./Pages/Checkout";
import AdminView from "./Pages/AdminView"; // Admin page component
import AdminCalendar from "./Pages/AdminCalendar"; // Admin Calendar component
import ConfirmAdmin from "./Pages/AdminConfirm";
import AdminDataView from "./Pages/AdminCalendarValueView";
import PerformancePage from "./Pages/Performance";
import FirstHome from "./Pages/FirstHome"


function AppRoutes() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdmin = searchParams.get("isadmin") === "true";

  if (isAdmin) {
    // Render AdminView and AdminCalendar for admin
    return (
      <Routes>
        <Route path="/" element={<AdminView />} />
        <Route path="/adminCalendar" element={<AdminCalendar />} />
        <Route path="/admincalendarvalueview" element={<AdminDataView />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/adminConfirm" element={<ConfirmAdmin />} />
      </Routes>
    );
  }

  //  not admin
  return (
    <Routes>
      <Route path="/" element={<FirstHome />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/slotbooking" element={<Slotbooking />} />
      <Route path="/slotform" element={<Slotform />} />
      <Route path="/confirmPage" element={<Confirm />} />
      <Route path="/checkout" element={<Checkout />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App">
      <Router >
         <AppRoutes /> 
      </Router>
    </div>
  );
}

export default App;
