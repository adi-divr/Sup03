import React from "react";
import { useLocation } from "react-router-dom";
import "./checkout.css";
import logo from "../../src/assets/logo.png";
import imageQR from "../../src/assets/QR.png";

const Checklast = () => {
  // Extract amount dynamically from URL
  const query = new URLSearchParams(useLocation().search);
  // const amount = query.get("amount") || "0";

  return (
    <div className="confirm-container1">
      <div className="logo-container1">
        <img src={logo} alt="Logo1" width={100} height={100} />
      </div>
      <p className="scan-title1">SCAN TO PAY</p>

      {/* QR Code Section */}
      <div className="qr-section1">
        <img
          src={imageQR}
          alt="QR Code1"
          width={232}
          height={268}
          className="qr-image1"
        />
        <p className="amount-text1">
          Amount: <span className="amount-value1">{query} INR</span>
        </p>
      </div>

      {/* Instructions */}
      <div className="instructions1">
        <ol>
          <li>
            Please take a screenshot of your UPI receipt and send it to us on
            WhatsApp at <strong>+91 9778413792</strong>.
          </li>
          <li>After payment, our instructor will confirm your booking via WhatsApp within 12 hours.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Checklast;
