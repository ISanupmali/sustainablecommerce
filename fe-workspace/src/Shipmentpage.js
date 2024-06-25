import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import "./App.css";

class Shipmentpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sFirstName: "",
      sLastName: "",
      sAddress1: "",
      sPostalCode: "",
      sCity: "",
      sState: "",
      sCountry: "US", // Default value set to "US"
      bFirstName: "",
      bLastName: "",
      bAddress1: "",
      bPostalCode: "",
      bCity: "",
      bState: "",
      bCountry: "US", // Default value set to "US"
      basketId: props.match.params.id,
      submitted: false,
      isLoaded: false,
      useAsBilling: true,
      basket: [],
      headers: "",
      inThirtyMinutes: new Date(new Date().getTime() + 30 * 60 * 1000),
      errors: {}, // To store validation errors
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      errors: { ...this.state.errors, [name]: '' } // Clear the error for the specific field
    });
  };

  handleUseAsShipping = (event) => {
    this.setState({
      useAsBilling: event.target.checked,
    });
  };

  validateFields = () => {
    const errors = {};
    if (!this.state.sFirstName) errors.sFirstName = "First Name is required";
    if (!this.state.sLastName) errors.sLastName = "Last Name is required";
    if (!this.state.sAddress1) errors.sAddress1 = "Address Line 1 is required";
    if (!this.state.sPostalCode) errors.sPostalCode = "Postal Code is required";
    if (!this.state.sCity) errors.sCity = "City is required";
    if (!this.state.sState) errors.sState = "State is required";
    return errors;
  };

  handleSubmission = (event) => {
    event.preventDefault();
    const errors = this.validateFields();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    var billing = this.state.useAsBilling
      ? {}
      : {
          firstName: this.state.bFirstName,
          lastName: this.state.bLastName,
          address1: this.state.bAddress1,
          postalCode: this.state.bPostalCode,
          city: this.state.bCity,
          stateCode: this.state.bState,
          countryCode: this.state.bCountry,
        };
    var params = {
      useAsBilling: this.state.useAsBilling,
      shipping: {
        firstName: this.state.sFirstName,
        lastName: this.state.sLastName,
        address1: this.state.sAddress1,
        postalCode: this.state.sPostalCode,
        city: this.state.sCity,
        stateCode: this.state.sState,
        countryCode: this.state.sCountry,
      },
      billing: billing,
    };

    this.setState({ submitted: true });
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/shipment/add/` + this.state.basketId,
        {
          params: params,
          headers: this.state.headers,
        }
      )
      .then((res) => {
        const basket = res.data;
        this.setState({ basket });
        this.setState({ isLoaded: true });
        window.location.href =
          `/payment/` + basket.basketId + `?orderTotal=` + basket.orderTotal;
      });
  };

  async fetchCartInfo(headers) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/baskets/` +
          this.props.match.params.id,
        { headers: headers }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching cart info", error);
      window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/carterror`;
    }
  }

  async componentDidMount() {
    const bearerToken = Cookies.get("bearerToken");
    const inThirtyMinutes = 1 / 48;

    if (!bearerToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/shopper/auth/guest`)
        .then((res) => {
          const bearerToken = res.data;
          Cookies.set("bearerToken", bearerToken, {
            expires: inThirtyMinutes,
          });
          this.setState({ bearerToken });
          const headers = {
            "Content-Type": "application/json",
            Authorization: "Bearer " + bearerToken,
          };
          this.setState({ headers });
          this.fetchCartInfo(headers);
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
        const basket = await this.fetchCartInfo(headers);
        if (basket) {
          this.setState({ basket, productItemsArr: basket.productItems });
        }
      } catch (error) {
        console.error("Error fetching basket info", error);
        window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/carterror`;
      }
    }
  }

  render() {
    const basketObj = this.state.basket;
    const { errors } = this.state;
    if (this.state.submitted === false) {
      return (
        <div>
          <Helmet>
            <title>Shipping page</title>
            <meta name="theme-color" content="#ccc" />
          </Helmet>
          <Navbar></Navbar>
          <div className="contashipping-heading container">
            <div className="row mt-3 mb-5 p-3 my-3 alert alert-success">
              <div className="col col-lg-9 col-sm-8">
                <h5>
                  <span className="fa fa-shopping-cart"></span> Shipping /
                  Billing Info
                </h5>
              </div>
              <div className="col col-lg-3 col-sm-4">
                <a
                  href="/"
                  className="btn btn-warning btn-sm btn-block"
                  role="button"
                >
                  <span className="glyphicon glyphicon-share-alt"></span>{" "}
                  Continue shopping
                </a>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-8 col-sm-12">
                <form onSubmit={this.handleSubmission}>
                  <div className="form-group shipping">
                    <h5>
                      <span className="fa fa-truck"></span> Shipping Address
                    </h5>
                    <div className="row">
                      <div className="col-sm">
                        <input
                          className={`form-control form-control-sm mb-3 ${errors.sFirstName ? 'is-invalid' : ''}`}
                          placeholder="First Name"
                          type="text"
                          name="sFirstName"
                          value={this.state.sFirstName}
                          onChange={this.handleChange}
                        />
                        {errors.sFirstName && (
                          <div className="invalid-feedback">{errors.sFirstName}</div>
                        )}
                      </div>
                      <div className="col-sm">
                        <input
                          className={`form-control form-control-sm mb-3 ${errors.sLastName ? 'is-invalid' : ''}`}
                          type="text"
                          placeholder="Last Name"
                          name="sLastName"
                          value={this.state.sLastName}
                          onChange={this.handleChange}
                        />
                        {errors.sLastName && (
                          <div className="invalid-feedback">{errors.sLastName}</div>
                        )}
                      </div>
                    </div>
                    <input
                      className={`form-control form-control-sm mb-3 ${errors.sAddress1 ? 'is-invalid' : ''}`}
                      type="text"
                      placeholder="Address Line 1"
                      name="sAddress1"
                      value={this.state.sAddress1}
                      onChange={this.handleChange}
                    />
                    {errors.sAddress1 && (
                      <div className="invalid-feedback">{errors.sAddress1}</div>
                    )}
                    <div className="row">
                      <div className="col-sm">
                        <input
                          className={`form-control form-control-sm mb-3 input-sm ${errors.sPostalCode ? 'is-invalid' : ''}`}
                          placeholder="Postal Code"
                          type="text"
                          name="sPostalCode"
                          value={this.state.sPostalCode}
                          onChange={this.handleChange}
                        />
                        {errors.sPostalCode && (
                          <div className="invalid-feedback">{errors.sPostalCode}</div>
                        )}
                      </div>
                      <div className="col-sm">
                        <input
                          className={`form-control form-control-sm mb-3 input-sm ${errors.sCity ? 'is-invalid' : ''}`}
                          placeholder="City"
                          type="text"
                          name="sCity"
                          value={this.state.sCity}
                          onChange={this.handleChange}
                        />
                        {errors.sCity && (
                          <div className="invalid-feedback">{errors.sCity}</div>
                        )}
                      </div>
                      <div className="col-sm">
                        <input
                          className={`form-control form-control-sm mb-3 input-sm ${errors.sState ? 'is-invalid' : ''}`}
                          placeholder="State"
                          type="text"
                          name="sState"
                          value={this.state.sState}
                          onChange={this.handleChange}
                        />
                        {errors.sState && (
                          <div className="invalid-feedback">{errors.sState}</div>
                        )}
                      </div>
                    </div>
                    <select
                        className="form-control form-control-sm mb-3 input-sm"
                        name="sCountry"
                        value="{this.state.sCountry}"
                        onChange={this.handleChange}
                        disabled
                      >
                      <option value="US">US</option>
                    </select>
                    <label className="text-muted">Use same as shipping :</label>
                    <input
                      type="checkbox"
                      checked={this.state.useAsBilling}
                      onChange={this.handleUseAsShipping}
                      disabled
                    />
                  </div>
                  {this.state.useAsBilling ? (
                    ""
                  ) : (
                    <div>
                      <h5>
                        <span className="fa fa-cc mt-5 mb-4"></span> Billing
                        Address
                      </h5>
                      <div>
                        <div className="row">
                          <div className="col-sm">
                            <input
                              className="form-control form-control-sm mb-3"
                              placeholder="First Name"
                              type="text"
                              name="bFirstName"
                              value={this.state.bFirstName}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-sm">
                            <input
                              className="form-control form-control-sm mb-3"
                              type="text"
                              placeholder="Last Name"
                              name="bLastName"
                              value={this.state.bLastName}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <input
                          className="form-control form-control-sm mb-3"
                          type="text"
                          placeholder="Address Line 1"
                          name="bAddress1"
                          value={this.state.bAddress1}
                          onChange={this.handleChange}
                        />
                        <div className="row">
                          <div className="col-sm">
                            <input
                              className="form-control form-control-sm mb-3 input-sm"
                              placeholder="Postal Code"
                              type="text"
                              name="bPostalCode"
                              value={this.state.bPostalCode}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-sm">
                            <input
                              className="form-control form-control-sm mb-3 input-sm"
                              placeholder="City"
                              type="text"
                              name="bCity"
                              value={this.state.bCity}
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-sm">
                            <input
                              className="form-control form-control-sm mb-3 input-sm"
                              placeholder="State"
                              type="text"
                              name="bState"
                              value={this.state.bState}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <select
                          className="form-control form-control-sm mb-3 input-sm"
                          name="bCountry"
                          value={this.state.bCountry}
                          onChange={this.handleChange}
                          disabled
                        >
                          <option value="US">US</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <hr />

                  <div className="row mb-4">
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary w-100 mt-2"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-lg-4 col-sm">
                <div className="alert alert-info">
                  <div className="badge-warning mb-3">
                    <span className="fa fa-lg fa-exclamation-triangle"></span>{" "}
                    IN-STORE PICKUP NOT AVAILABLE
                  </div>
                  <div className="border border-secondary p-2 rounded">
                    <p>
                      We regret to inform you that instore pickup is not
                      available in your area. Enter your address to get your
                      order at your doorstep.
                    </p>
                  </div>
                </div>
                <hr />
                <div className="alert alert-info">
                  <p className="text-right font-weight-lighter">
                    Product Sub Total:{" "}
                    <strong>
                      ${parseFloat(basketObj.productSubTotal).toFixed(2)}
                    </strong>
                    <br />
                    Adjusted Total Tax:{" "}
                    <strong>${basketObj.adjustedMerchandizeTotalTax}</strong>
                    <br />
                    Total:{" "}
                    <strong>
                      ${parseFloat(basketObj.productTotal).toFixed(2)}
                    </strong>
                    <br />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    } else {
      return (
        <div>
          <Helmet>
            <title>Shipping page</title>
            <meta name="theme-color" content="#ccc" />
          </Helmet>
          <Navbar></Navbar>
          <div className="contashipping-heading container card bg-white">
            <div className="row">
              <div className="col-1">
                <Spinner animation="border" size="lg" />
              </div>
              <div className="col-11">
                <h3>Navigating to Payment Page</h3>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
  }
}

export default Shipmentpage;
