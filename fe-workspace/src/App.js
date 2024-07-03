import logo from "./logo.svg";
import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Herobanner from "./components/home/Herobanner";
import Testimonials from "./components/home/Testimonials";
import "./App.css";

class App extends React.Component {
  state = {
    products: [],
    bearerToken: "",
    headers: "",
    inThirtyMinutes: new Date(new Date().getTime() + 30 * 60 * 1000),
  };

  async fetchCategoryData1(headers) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/category/dresses`,
        {
          headers: headers,
        }
      );
      return res.data.hits;
    } catch (error) {
      console.error("Error fetching cart info", error);
      window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
    }
  }

  async componentDidMount() {
    const bearerToken = Cookies.get("bearerToken");
    const inThirtyMinutes = 1 / 48;

    if (!bearerToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/shopper/auth/guest`)
        .then(async (res) => {
          const bearerToken = res.data;
          Cookies.set("bearerToken", bearerToken, {
            expires: inThirtyMinutes,
          });
          const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + bearerToken,
          };
          this.setState({ headers });
          const categoryInfo = await this.fetchCategoryData1(headers);
          if (categoryInfo) {
            const products = categoryInfo;
            this.setState({ products });
          }
        });
    } else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + bearerToken,
      };
      this.setState({ headers });
      const categoryInfo = await this.fetchCategoryData1(headers);
      if (categoryInfo) {
        const products = categoryInfo;
        this.setState({ products });
      }
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <section className="1">
          <div className="container px-4 px-lg-5 my-5">
            <div className="row gx-4 gx-lg-5 align-items-center">
              <div className="col-md-12">
                <Herobanner />
              </div>
            </div>
          </div>
        </section>

        <section className="1">
          <div className="container px-4 px-lg-5 my-5">
            <div className="row gx-4 gx-lg-5 align-items-center">
              <div className="col-md-12">
                <Testimonials />
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 bg-light">
          <div className="container px-4 px-lg-5 mt-1">
            <h2 className="fw-bolder mb-4 text-center">Top Recommendations</h2>
            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
              {this.state.products.map((product) => (
                <div className="col mb-5" key={product.productId}>
                  <div className="card h-100">
                    <Link
                      className="btn btn-outline-dark mt-auto"
                      to={"/product/" + product.productId}
                    >
                      <img
                        className="card-img-top"
                        src={product.image.link}
                        alt="..."
                      />
                    </Link>
                    <div className="card-body p-4">
                      <div className="text-center">
                        <h5 className="fw-bolder">{product.productName}</h5>$
                        {product.price}
                      </div>
                    </div>
                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                      <div className="text-center">
                        <Link
                          className="btn btn-outline-dark mt-auto"
                          to={"/product/" + product.productId}
                        >
                          View options
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default App;
