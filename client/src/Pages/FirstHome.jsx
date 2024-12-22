import React, { useState } from "react";
import logo from "../../src/assets/logo.png";
import paddleImage from "../../src/assets/Paddle.png";
import whatsIncluded from "../../src/assets/whatsincluded.png";
import review1 from "../../src/assets/review1.png";
import review2 from "../../src/assets/review2.png";
import review3 from "../../src/assets/review3.png";
import review4 from "../../src/assets/review4.png";
import review5 from "../../src/assets/review5.png";
import gallery1 from "../../src/assets/gallery1.png";
import gallery2 from "../../src/assets/gallery2.png";
import gallery3 from "../../src/assets/gallery3.png";
import gallery4 from "../../src/assets/gallery4.png";
import "./firsthome.css";
import { useNavigate } from "react-router-dom"; 



const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
}

  return (
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

      <div className="card-container-Home">
        <img src={whatsIncluded} alt="Card-Home" className="card-image-Home" />
      </div>

      <div className="review-card-Home">
        {[review1, review2, review3, review4, review5].map((review, index) => (
          <div className="card-container-Home" key={index}>
            <img src={review} alt={`Review ${index + 1}`} className="card-image-Home" />
          </div>
        ))}
      </div>

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
    </div>
  );
};

export default Home;
