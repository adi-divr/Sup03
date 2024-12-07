import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Calendar from './Pages/Calendar';
import Slotbooking from './Pages/Slotbooking';
import Slotform from './Pages/Slotform';
import Confirm from './Pages/ConfirmPage';
import Checkout from './Pages/Checkout';

function App() {
  return (
    <div className="App">
      <Router basename="/Sup03">
        <Routes>
          {/* Route for Calendar page */}
          <Route path="/" element={<Calendar />} />

          {/* Route for Slotbooking */}
          <Route path="/slotbooking" element={<Slotbooking />} />

          {/* Route for Slotform */}
          <Route path="/slotform" element={<Slotform />} />

          {/* Route for Confirm */}
          <Route path="/confirmPage" element={<Confirm />} />

          {/* Route for Checkout (Checklast) */}
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
