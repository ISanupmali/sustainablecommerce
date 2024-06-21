import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet";

class Carterrorpage extends React.Component {
  componentWillMount() {
    const bearerToken = Cookies.get("bearerToken");
    if (bearerToken) {
      Cookies.set("bearerToken", bearerToken, {
        expires: 0,
      });
    }

    sessionStorage.removeItem("basketData");
  }

  render() {
    var basketData = sessionStorage.getItem("basketData")
      ? JSON.parse(sessionStorage.getItem("basketData"))
      : "";

    return (
      <div>
        <Helmet>
          <title>Your Cart</title>
          <meta name="theme-color" content="#ccc" />
        </Helmet>
        <Navbar navBarBasketData={basketData}></Navbar>
        <section className="1">
          <div className="container px-4 px-lg-5 my-5">
            <div className="jumbotron">
              <h1 className="display-4">Your Session Has Expired</h1>
              <p className="lead">
                Please navigate to the Home Page and start adding new items to
                your basket.
              </p>
              <hr className="my-4" />
              <p>
                This may have occurred due to inactivity for a long time or a
                basket error.
              </p>
              <p className="lead">
                <a className="btn btn-primary btn-lg" href="/" role="button">
                  Navigate to Homepage
                </a>
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}
export default Carterrorpage;
