import logo from "./logo.svg";
import React, { Component } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Link } from "react-router-dom";
import Loading from "./components/Loading";
import Categorybanner from "./components/Categorybanner";
import "./App.css";

class Categorypage extends React.Component {
  state = {
    products: [],
    bearerToken: "",
    headers: "",
    isLoading: true,
  };

  async fetchCategoryData(headers) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/category/` +
          this.props.match.params.id,
        { headers: headers }
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
          const categoryInfo = await this.fetchCategoryData(headers);
          if (categoryInfo) {
            const products = categoryInfo;
            this.setState({ products });
          }
        })
        .catch((error) => {
          console.error("Error fetching guest auth token:", error);
          window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
        });
    } else {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + bearerToken,
        };
        this.setState({ headers });
        const categoryInfo = await this.fetchCategoryData(headers);
        if (categoryInfo) {
          const products = categoryInfo;
          this.setState({ products });
          this.setState({ isLoading: false });
        }
      } catch (error) {
        console.error("Error fetching product info", error);
        this.setState({ isLoading: false });
        window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({ isLoading: true });
      const categoryInfo = await this.fetchCategoryData(this.state.headers);
      if (categoryInfo) {
        const products = categoryInfo;
        this.setState({ products, isLoading: false });
      }
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <section className="py-2 bg-light" style={{ minHeight: "600px" }}>
          <div className="container px-4 px-lg-5 mt-5">
            <h2 className="fw-bolder mb-4 cattitle text-capitalize">
              {this.props.match.params.id.replace(/-/g, ' ')} Category
            </h2>
            <Categorybanner/>
            {this.state.isLoading ? (
              <Loading />
            ) : (
              <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                {this.state.products.map((product) => (
                  <div className="col mb-5">
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
            )}
          </div>
        </section>

        <Footer />
      </div>
    );
  }
}

export default Categorypage;
