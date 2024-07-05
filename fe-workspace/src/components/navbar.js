import React, { Component } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showPopup: false };
  }

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
                <Link className="nav-link btn btn-link btn-warning" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-link btn-warning" to="/category/fresh-veggies">
                  Fresh Veggies
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-link btn-warning" to="/category/exotic-fruits">
                  Exotic Fruits
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link btn btn-link btn-warning" to="/sustainibility-via-bopis">
                    Promoting Sustainability via BOPIS
                </Link>
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
      </nav>
    );
  }
}

export default Navbar;
