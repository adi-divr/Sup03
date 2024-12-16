import React, {  useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // React Router
import logo from "../../src/assets/logo.png"; 
import "./slotform.css";


const Slotform = () => {
  const [mail, setMail] = useState("");
  const [number, setMobile] = useState("");
  const [name, setName] = useState("");
  const [weighData, setweighData] = useState("");
  const [ageData, setageData] = useState("");
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [formData, setFormData] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search); // Parse query params
  const selected = queryParams.get("selectedDate");
  const slots = Number(queryParams.get("slots"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentForm = { name, mail, number, weighData, ageData };
    setFormData((prevFormData) => [...prevFormData, currentForm]); 

    if (currentFormIndex + 1 < slots) {
      setCurrentFormIndex(currentFormIndex + 1);
    } else {
      sessionStorage.setItem("formData", JSON.stringify([...formData, currentForm]));
      sessionStorage.setItem("slotAndDate", JSON.stringify({ selectedDate: selected, slots }));
      navigate("/confirmPage");
    }

    setMail("");
    setMobile("");
    setName("");
    setweighData("");
    setageData("");
  };

  useEffect(() => {
    if (formData.length > 0) {
      sessionStorage.setItem("formData", JSON.stringify(formData));
    }
  }, [formData]);

  return (
    <div className="container">
<div className="logo">
          <img src={logo} alt="Logo" width={150} height={150} />
        </div>
        <p className="centered-text">
  <strong>TELL US MORE ABOUT YOURSELF</strong>
</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name.."
          required
        />

        <label htmlFor="mailbox">Email:</label>
        <input
          type="email"
          id="mailbox"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          placeholder="Your email.."
          required
        />

        <label htmlFor="mobilenum">Phone:</label>
        <input
          type="text"
          id="mobilenum"
          value={number}
          onChange={(e) => setMobile(e.target.value)}
          placeholder="Your Mobile number.."
          required
        />
        <h3>Weight</h3>
        <p>Do you weigh below 100kg?</p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="weighquery"
              value="yes"
              checked={weighData === "yes"}
              onChange={(e) => setweighData(e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="weighquery"
              value="no"
              checked={weighData === "no"}
              onChange={(e) => setweighData(e.target.value)}
            />
            No
          </label>
        </div>
        {weighData === "no" && (
  <div className="warning-message">
    <p>
      <strong className="warning-text">Warning</strong>
      <span className="warning-description">
        Please note that paddling can be challenging for individuals over 100 kg.
        If you're confident, we're happy to accommodate your booking.
      </span>
    </p>
  </div>
)}
                <h3>Age</h3>
        <p>Are you over 18?</p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="agequery"
              value="yes"
              checked={ageData === "yes"}
              onChange={(e) => setageData(e.target.value)}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="agequery"
              value="no"
              checked={ageData === "no"}
              onChange={(e) => setageData(e.target.value)}
            />
            No
          </label>
        </div>

        {currentFormIndex + 1 < slots ? (
          <button type="submit">Next</button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </form>
    </div>
  );
};

export default Slotform;
