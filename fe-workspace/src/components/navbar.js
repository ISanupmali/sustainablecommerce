import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

  togglePopup = () => {
    this.setState({ showPopup: !this.state.showPopup });
  };

  render() {
    var basketData = sessionStorage.getItem("basketData")
      ? JSON.parse(sessionStorage.getItem("basketData"))
      : "";
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container px-4 px-lg-5">
          <Link className="navbar-brand logo" to="/">
            SC
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
              <li className="nav-item">
                <Link className="nav-link active" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/mens">
                  Mens
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/womens">
                  Womens
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/category/electronics">
                  Electronics
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={this.togglePopup}>
                  Info
                </button>
              </li>
            </ul>
            <form className="d-flex">
              <Link
                className="btn btn-outline-dark"
                to={basketData ? "/baskets/" + basketData["basketId"] : "#"}
              >
                <i className="bi-cart-fill me-1"></i>
                Cart
                <span className="badge bg-dark text-white ms-1 rounded-pill">
                  {basketData["basketCount"]}
                </span>
              </Link>
            </form>
          </div>
        </div>
        {this.state.showPopup && (
          <div className="popup">
            <div className="popup-inner">
              <p>This site is a Proof of Concept (POC). <br/><br/>If you experience any errors while using the site, please clear the site data from your browser settings and start again from the homepage.</p>
              <button className="btn btn-secondary" onClick={this.togglePopup}>Close</button>
            </div>
          </div>
        )}
      </nav>
    );
  }
}

export default Navbar;
