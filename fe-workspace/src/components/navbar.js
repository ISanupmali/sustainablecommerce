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
                <button className="nav-link btn btn-link btn-warning" onClick={this.togglePopup}>
                  Promoting Sustainability via BOPIS
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
            <div className="popup-inner smallfont">
              <p>At our eCommerce store, we are deeply committed to promoting sustainability and minimizing plastic waste in e-commerce packaging. We believe that every small step can lead to a significant impact on our environment. That’s why we are excited to offer our Buy Online - Pick Up in Store (BOPIS) option, which not only helps reduce packaging waste but also rewards our eco-conscious customers.</p><p><strong>How It Works:</strong></p><ol><li><p><strong>Choose BOPIS During Checkout:</strong> When you shop with us online, simply select the BOPIS option during checkout. By doing so, you are choosing to pick up your order at our store, thereby reducing the need for excessive packaging materials used in shipping.</p></li><li><p><strong>Use Green Transportation:</strong> To further promote sustainability, we encourage our customers to use a green mode of transportation such as a Bicycle, Bus, or Electric Vehicle when coming to pick up their order. When you arrive at the store using one of these eco-friendly modes of transport, you will be eligible for additional rewards.</p></li><li><p><strong>Get Rewarded at the Store:</strong> Upon reaching our store, you can choose one of the following fun and engaging activities to receive a reward coupon, which can be used for your next order:</p><ul><li><p><strong>Spin the Wheel Game:</strong> Spin the wheel and stand a chance to win exciting discounts and offers. It's a fun and interactive way to get rewarded for your sustainable choices.</p></li><li><p><strong>Scan Bus QR:</strong> If you traveled by bus, simply scan the special QR code at our store to instantly receive your reward. This quick and easy method ensures that you are recognized for your eco-friendly efforts.</p></li><li><p><strong>10 Squats Game:</strong> Show your fitness enthusiasm by performing 10 squats at our store. It’s a great way to stay active and earn rewards simultaneously.</p></li></ul></li></ol><p>By choosing our BOPIS option, not only do you contribute to reducing plastic waste, but you also become a part of our community that values sustainability and healthy living. We believe in rewarding our customers for their eco-friendly choices and making the world a better place, one order at a time.</p><p>Join us in our mission to promote sustainability. Shop online, pick up in store, and get rewarded for making green choices. Together, we can make a difference!</p>        
              <button className="btn btn-secondary" onClick={this.togglePopup}>Close</button>
            </div>
          </div>
        )}
      </nav>
    );
  }
}

export default Navbar;
