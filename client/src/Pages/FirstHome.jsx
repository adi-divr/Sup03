import React, { useState } from "react";
import logo from "../../src/assets/logo.png";
import paddleImage from "../../src/assets/Paddle.png";
import review1 from "../../src/assets/review1.png";
 import review2 from "../../src/assets/review2.png";
// import review3 from "../../src/assets/review3.png";
// import review4 from "../../src/assets/review4.png";
// import review5 from "../../src/assets/review5.png";
import gallery1 from "../../src/assets/gallery1.png";
import gallery2 from "../../src/assets/gallery2.png";
import gallery3 from "../../src/assets/gallery3.png";
import gallery4 from "../../src/assets/gallery4.png";
import "./firsthome.css";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, useMap, Marker,Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import clock from "../../src/assets/clock.png"
import bulb from "../../src/assets/bulb.png"
import carparking from "../../src/assets/carparking.png"
import downarrow from "../../src/assets/Chevron down.png"
import locationicon from "../../src/assets/location.png"
import L from 'leaflet';
import GoogleMap from './GoogleMap'
import dollarsign from '../../src/assets/dollarsign.png'
import mapicon from "../../src/assets/mapicon.png"
import carIcon from "../../src/assets/caricon.png"
import Frame4 from "../../src/assets/Frame 4.png"



const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const customIcon = L.icon({
    iconUrl: locationicon, 
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32], 
  });
  
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const accordionData = [
    { title: "Sunrise ", content: "Trust us, this is worth waking up for! Join us on the board and take in the incredible view of the sunrise over the Kochi backwaters. It's a great way to burn some calories and get your daily dose of vitamin D. For SUP in Kochi, this is the real happy hour." },
    { title: "Social ", content: "Make the best of your mornings, whether it's a group workout or just some quality time with yourself. Tag your friends and family for a fun time on the water. The best part about starting the session from the Ramada Resort is having the option to end it at the Ramada breakfast buffet! (650 INR + taxes/person). Treat yourselves to a delicious breakfast and maybe even a massage at the Ramada Resort spa after your session. (reservation required - contact the spa at +918714380997)" },
    { title: "Safe ", content: "There is no need to worry about your safety; you are in good hands. Our qualified instructors are there with you every step of the way. We provide all the necessary safety gear and world-class amenities to ensure you have a fun and safe time out on the water. And no, you don't have to be a professional swimmer to SUP with us." },
    { title: "Ice bath", content: "Please be mindful of the following:" },
  ];



  const accordionDataFaq = [
    { title: "What is SUP? ", content: "Stand-up paddle boarding (SUP) is a water sport but also much more. SUP is a great way to stay fit, work on your core balance and get that full-body workout. What is amazing about this sport is that it helps you escape the monotony of everyday life and experience the outdoors from a different perspective. SUP is easy to learn and great for all skill levels." },
    { title: "Can anybody SUP? ", content: "Yes. All participants should be in general good health and below 100 kg in weight." },
    { title: "What route will I be taking on the water? ", content: "We start and end the session from the Ramada Resort Jetty and paddle out to the backwaters of Kumbalam and Panangad. " },
    { title: "How do I pay for my session?", content: "You pay via UPI to our official number +91 97784 13792." },
    { title: "How do I confirm my booking?", content: "Once you pay via UPI on our official number, +91 97784 13792, you need to send a screenshot of the payment confirmation on WhatsApp to this number to confirm your slots." },
    { title: "What is the refund policy?", content: "We expect you to keep your appointment and be on time; however, if you are unable to do so under extenuating circumstances, we will allow you to change the session to another date (one time only) within 30 days of the original booking date. No refunds or sessions in lieu after the 30 days. " },
    { title: "What do I wear for a SUP session?", content: "SUP is an outdoor activity, so we recommend you wear comfortable athletic clothing and plenty of sunscreen. Feel free to bring a change of clothes, as you will have access to the Ramada changing rooms and shower facilities to freshen up after your session." },
    { title: "Where can I store my personal items?", content: "We recommend you leave your valuables in your car, however, your personal items can be safely stored at our locker by the instructor before you head out on the water." },
    { title: "Should I carry my phone?", content: "Our instructors will take photos of your session and share them with you later so you can just focus on having a good time. We don’t recommend taking your phones with you and are not responsible for loss of device." },
    { title: "Are children allowed?", content: "We allow children to join us with their parent/adult guardian, who should join us for the same session. Ideally, the child has to be over 20 kg in weight and a good swimmer." },

  ];



  const galleryImages = [gallery1, gallery2, gallery3, gallery4];
  const navigate = useNavigate();

  const handlePrevious = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };

  const handleBook = () => {
    navigate(`/calendar`);
  };
  const position = [9.888636413957762, 76.31671443068677]

  return (
    <div className="home-wrapper">
    <div className="container-Home">
      <div className="logo-Home">
        <img src={logo} alt="Logo-Home" width={150} height={150} />
      </div>

      <div className="card-container-Home">
        <img src={paddleImage} alt="Card-Home" className="card-image-Home" />
      </div>

      <button type="button" onClick={handleBook} className="btn-home">
        Book Now
      </button>

      <div className="info-card-Home">
        <img src={dollarsign} alt="Price Icon" className="clockicon" />
        <div className="text-Home">
          <h3>Price</h3>
          <p>Sunrise SUP: 1500 INR</p>
          <p>SUP + Ice Bath: 2000 INR</p>
          <p>Private/Corporate: Contact Us</p>
        </div>
      </div>

      <div className="info-card-Home">
        <img src={clock} alt="Clock Icon" className="clockicon" />
        <div className="text-Home">
          <h3>Date & Time</h3>
          <p className="highlight-Home">Open Everyday</p>
          <p>Sunrise session: 6:00 am - 8:00 am</p>
          <p>
            Monsoon only second session: 8:30 am - 10:00 am <br />
            <span className="note-Home">(subject to weather and tide conditions)</span>
          </p>
        </div>
      </div>

      <div className="info-card-Home-bulb">
        <img src={bulb} alt="Bulb Icon" className="bulb-icon" />
        <div className="text-Home">
          <p>
            Please arrive 10 minutes early. We start on time for safety reasons and
            will not wait or issue refunds for late arrival.
          </p>
        </div>
      </div>

      <div className="display-map-container">
  <div className="map-header">
    <img src={mapicon} alt="map Icon" className="map-icon" />
    <h4 className="map-header-title">Location</h4>
  </div>
  <GoogleMap />
  <img src={Frame4} alt="iconimage" className="map-desc-icon" />
</div>



<div className="info-card-parking">
  <div className="parking-container">
      <img src={carIcon} alt="Car Icon" className="icon-parking" />
      <div className="text-parking">
        <h3>Parking</h3>
        <p>Secure & free parking is available at the property</p>
      </div>
      </div>
    </div>
    




      <div className="book-slots-container">
        <h3 className="book-slots-title">Book your slots</h3>
        <ol className="book-slots-list">
          <li>
             Check the availability 
          </li>
          <li>Fill up the form.</li>
          <li>Make your payment.</li>
        </ol>
        <button className="check-availability-button" onClick={handleBook}>Check Availability</button>
      </div>

      <div className="accordion-container">
        {accordionData.map((item, index) => (
          <div key={index} className="accordion-item">
            <button
              className={`accordion-header ${activeIndex === index ? "active" : ""}`}
              onClick={() => toggleAccordion(index)}
            >
              <span>{item.title}</span>
              <img src={downarrow} alt="down" className="accordion-arrow" />
            </button>
            {activeIndex === index && (
              <div className="accordion-content">
                <p>{item.content}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="review-card-Home">
        <p style={{ textAlign: "left" }}>Google Reviews</p>
        {[review1].map((review, index) => (
          <div className="card-container-Home" key={index}>
            <img src={review1} alt={`Review ${index + 1}`} className="card-image-Home" />
            <img src={review2} alt={`Review ${index + 1}`} className="card-image-Home" />

          </div>
        ))}
      </div>


 <button type="button" onClick={handleBook} className="btn-home">
        Book Now
      </button>


      <div className="gallery-card-Home">
        <p>Gallery</p>
        <div className="carousel-Home">
          <button className="carousel-Home-button left" onClick={handlePrevious}>
            &#9664;
          </button>
          <img
            src={galleryImages[currentImageIndex]}
            alt={`Gallery ${currentImageIndex + 1}`}
            className="carousel-Home-image"
          />
          <button className="carousel-Home-button right" onClick={handleNext}>
            &#9654;
          </button>
        </div>
      </div>



      <div className="accordion-container-faq">
  <p className="faq-title">FAQs</p>
  {accordionDataFaq.map((item, index) => (
    <div key={index} className="accordion-item-faq">
      <button
        className={`accordion-header-faq ${activeIndex === index ? "active" : ""}`}
        onClick={() => toggleAccordion(index)}
      >
        <img src={downarrow} alt="down" className="accordion-arrow-faq" />
        <span>{item.title}</span>
      </button>
      {activeIndex === index && (
        <div className="accordion-content-faq">
          <p>{item.content}</p>
        </div>
      )}
    </div>
  ))}
</div>



    </div>
  </div>
  );
};

export default Home;
