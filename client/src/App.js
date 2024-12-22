import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import CalendarWithNavigation from "./Pages/Calendar";
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
import LoginPage from "./Pages/Login";
import { AuthProvider } from "./Context/Authcontext";
import PrivateRoute from "./Context/PrivateRoute";
import DateBlocker from "./Pages/DateBlocker"

function AppRoutes() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isAdmin = searchParams.get("isadmin") === "true";

  if (isAdmin) {
    // Render AdminView and AdminCalendar for admin
    return (
      <Routes>
        <Route path="/" element={<LoginPage />} />    
        <Route path="/adminview" element={ <PrivateRoute><AdminView /></PrivateRoute>} />
        <Route path="/adminCalendar" element={<PrivateRoute><AdminCalendar /></PrivateRoute>} />
        <Route path="/blockdate" element={ <PrivateRoute><DateBlocker /></PrivateRoute>} />

        <Route path="/admincalendarvalueview" element={<PrivateRoute><AdminDataView /></PrivateRoute>} />
        <Route path="/performance" element={<PrivateRoute><PerformancePage /></PrivateRoute>} />
        <Route path="/adminConfirm" element={<PrivateRoute><ConfirmAdmin /></PrivateRoute>} />
      </Routes>
    );
  }

  //  not admin
  return (
    <Routes>
      <Route path="/" element={<FirstHome />} />
      <Route path="/calendar" element={<CalendarWithNavigation />} />
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
       <AuthProvider>
      <Router >
         <AppRoutes /> 
      </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
