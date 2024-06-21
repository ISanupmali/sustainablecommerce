import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet";

class Errorpage extends React.Component {
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
              <h1 className="display-4">You seem to be lost</h1>
              <p className="lead">
                Please navigate to the Home Page and start adding new items to
                your basket.
              </p>
              <hr className="my-2" />
              <img
                className="card-img-top mb-5 mb-md-0 border-0"
                src="https://cdn.pixabay.com/photo/2015/03/25/13/04/page-not-found-688965_1280.png"
                alt="404 Page"
              />
              <p>
                This may have happened because you tried to access a
                non-existent page on our site, or our system encountered an
                error while processing your request.
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
export default Errorpage;
