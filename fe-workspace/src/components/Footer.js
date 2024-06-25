import React, { useState } from "react";
import "../App.css";

const Footer = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <footer className="py-5 bg-dark">
      <div className="container">
        <p className="m-0 text-center text-white">
          Copyright &copy; Sustainable Commerce - SFCC Spartans - 2024
        </p>
        <p className="m-0 text-center text-white">
          <a href="#" onClick={togglePopup} style={{ color: "white", textDecoration: "underline" }}>
            Important Information
          </a>
        </p>
      </div>
      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
          <p>This site is a Proof of Concept (POC). <br/><br/>If you experience any errors while using the site, please clear the site data from your browser settings and start again from the homepage.</p>
            <button onClick={togglePopup} className="close-popup">
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
