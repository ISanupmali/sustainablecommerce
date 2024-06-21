import logo from "./logo.svg";
import React, { Component } from "react";
import axios from "axios";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import "./App.css";

class Layout extends React.Component {
  state = {
    products: [],
  };

  componentDidMount() {
    axios.get(`${process.env.REACT_APP_API_URL}category/shoes`).then((res) => {
      const products = res.data.hits;
      this.setState({ products });
      console.log(products);
    });
  }

  render() {
    return (
      <div>
        <Navbar></Navbar>
        <section className="1">
          <div className="container px-4 px-lg-5 my-5">
            <div className="row gx-4 gx-lg-5 align-items-center">
              <div className="col-md-12">
                <span className="border">
                  <img
                    className="card-img-top mb-5 mb-md-0 border-0 "
                    src="https://cdn.pixabay.com/photo/2024/03/26/11/57/woman-8656653_960_720.jpg"
                    alt="..."
                  />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-5 bg-light">
          <div className="container px-4 px-lg-5 mt-5">
            <h2 className="fw-bolder mb-4">Top Recommendations</h2>
            <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
              {this.state.products.map((product) => (
                <div className="col mb-5">
                  <div className="card h-100">
                    <img
                      className="card-img-top"
                      src={product.image.link}
                      alt="..."
                    />
                    <div className="card-body p-4">
                      <div className="text-center">
                        <h5 className="fw-bolder">{product.productName}</h5>$
                        {product.price}
                      </div>
                    </div>
                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                      <div className="text-center">
                        <a
                          className="btn btn-outline-dark mt-auto"
                          href={"/product/" + product.productId}
                        >
                          View options
                        </a>
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

export default Layout;
