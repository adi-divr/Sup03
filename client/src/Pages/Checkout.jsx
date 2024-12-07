import React from "react";
import "./checkout.css";
import logo from "../../src/assets/logo.png"; // Adjust the path to your project's structure
import imageQR from "../../src/assets/QR.png"; // Adjust the path to your project's structure

const Checklast = () => {
  return (
    <div className="confirm-container1">
      <div className="logo-container1">
        <img src={logo} alt="Logo1" width={150} height={150} />
      </div>
      <h2 className="checkout-title1">CHECKOUT</h2>
      <p className="scan-title1">Scan QR to pay</p>
      <img src={imageQR} alt="QR Code1" width={232} height={268} className="qr-image1" />
      <div className="instructions1">
        <p>
          <strong>To proceed with your booking, please</strong>
        </p>
        <ol>
          <li>Take a screenshot of your UPI or bank transfer payment receipt.</li>
          <li>
            Send it to us on WhatsApp at <strong>+91 9778413792</strong>
          </li>
        </ol>
      </div>
    </div>
  );
};

export default Checklast;
