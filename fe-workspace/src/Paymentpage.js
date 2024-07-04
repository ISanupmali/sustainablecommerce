import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import MaskedCardNumber from "./components/maskedcardnumber";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Spinner from "react-bootstrap/Spinner";
import "./App.css";

class Paymentpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardType: "",
      expirationMonth: "",
      expirationYear: "",
      cardHolder: "",
      cardNumber: "",
      totalAmount: "",
      basketId: props.match.params.id,
      basket: [],
      submitted: false,
      isLoaded: false,
      errors: {},
    };
  }

  handleCardType = (event) => {
    this.setState({
      cardType: event.target.value,
      errors: { ...this.state.errors, cardType: "" },
    });
  };

  handleExpirationMonth = (event) => {
    this.setState({
      expirationMonth: event.target.value,
      errors: { ...this.state.errors, expirationMonth: "" },
    });
  };

  handleExpirationYear = (event) => {
    this.setState({
      expirationYear: event.target.value,
      errors: { ...this.state.errors, expirationYear: "" },
    });
  };

  handleCardHolder = (event) => {
    this.setState({
      cardHolder: event.target.value,
      errors: { ...this.state.errors, cardHolder: "" },
    });
  };

  handleCardNumber = (event) => {
    this.setState({
      cardNumber: event.target.value,
      errors: { ...this.state.errors, cardNumber: "" },
    });
  };

  handleTotalAmount = (event) => {
    this.setState({
      totalAmount: event.target.value,
      errors: { ...this.state.errors, totalAmount: "" },
    });
  };

  validateFields = () => {
    const errors = {};
    if (!this.state.cardType) errors.cardType = "Card type is required";
    if (!this.state.cardHolder) errors.cardHolder = "Card holder name is required";
    if (!this.state.cardNumber) errors.cardNumber = "Card number is required";
    if (!this.state.expirationMonth) errors.expirationMonth = "Expiration month is required";
    if (!this.state.expirationYear) errors.expirationYear = "Expiration year is required";
    return errors;
  };

  handleSubmission = (event) => {
    event.preventDefault();
    const errors = this.validateFields();
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    var mask = MaskedCardNumber(this.state.cardNumber);
    const urlParams = new URLSearchParams(this.props.location.search);
    const orderTotal = urlParams.get("orderTotal");
    this.setState({ submitted: true });

    axios.get(`${process.env.REACT_APP_API_URL}/addpaymentinstrument/` + this.state.basketId, {
          params: {
            cardType: this.state.cardType,
            expirationMonth: this.state.expirationMonth,
            expirationYear: this.state.expirationYear,
            holder: this.state.cardHolder,
            maskedNumber: mask,
            orderTotal: orderTotal,
          },
          headers: this.state.headers
        }
      )
      .then((res) => {
        const basket = res.data;
        this.setState({ basket });
        this.setState({ isLoaded: true });
        console.log(basket);
        window.location.href = `/order/` + basket.basketId;
      });
  };

  async fetchCartInfo(headers) {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/baskets/` + this.props.match.params.id, {
        headers: headers 
      });
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
    const storeId = Cookies.get('storeId');
    if (this.state.submitted === false) {
      return (
        <div>
          <Helmet>
            <title>Payment page</title>
            <meta name="theme-color" content="#ccc" />
          </Helmet>
          <Navbar></Navbar>
          <div className="contashipping-heading paymentpage container mb-5">
            <div className="row mt-3 mb-5 p-3 my-3 alert alert-success">
              <div className="col col-lg-9 col-sm-8">
                <h5>
                  <span className="fa fa-shopping-cart"></span> Payment Information
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
                  <fieldset>
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="card-type">
                        Card Type
                      </label>
                      <div className="col-sm-9">
                        <select
                          className={`form-control col-sm-12 ${this.state.errors.cardType ? 'is-invalid' : ''}`}
                          name="card-type"
                          id="card-type"
                          onChange={this.handleCardType}
                        >
                          <option>Card Type</option>
                          <option value="Amex">American Express</option>
                          <option value="Diners">Diners Club</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="Visa">Visa</option>
                        </select>
                        {this.state.errors.cardType && (
                          <div className="invalid-feedback">{this.state.errors.cardType}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className="col-sm-3 control-label"
                        htmlFor="card-holder-name"
                      >
                        Name on Card
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${this.state.errors.cardHolder ? 'is-invalid' : ''}`}
                          name="card-holder-name"
                          id="card-holder-name"
                          placeholder="Card Holder's Name"
                          value={this.state.cardHolder}
                          onChange={this.handleCardHolder}
                        />
                        {this.state.errors.cardHolder && (
                          <div className="invalid-feedback">{this.state.errors.cardHolder}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className="col-sm-3 control-label"
                        htmlFor="card-number"
                      >
                        Card Number
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className={`form-control ${this.state.errors.cardNumber ? 'is-invalid' : ''}`}
                          name="card-number"
                          id="card-number"
                          placeholder="Debit/Credit Card Number"
                          value={this.state.cardNumber}
                          onChange={this.handleCardNumber}
                        />
                        {this.state.errors.cardNumber && (
                          <div className="invalid-feedback">{this.state.errors.cardNumber}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className="col-sm-3 control-label"
                        htmlFor="expiry-month"
                      >
                        Expiration Date
                      </label>
                      <div className="col-sm-9">
                        <div className="row">
                          <div className="col-6">
                            <select
                              className={`form-control col-sm-12 ${this.state.errors.expirationMonth ? 'is-invalid' : ''}`}
                              name="expiry-month"
                              id="expiry-month"
                              onChange={this.handleExpirationMonth}
                            >
                              <option>Month</option>
                              <option value="1">Jan (01)</option>
                              <option value="2">Feb (02)</option>
                              <option value="3">Mar (03)</option>
                              <option value="4">Apr (04)</option>
                              <option value="5">May (05)</option>
                              <option value="6">June (06)</option>
                              <option value="7">July (07)</option>
                              <option value="8">Aug (08)</option>
                              <option value="9">Sep (09)</option>
                              <option value="10">Oct (10)</option>
                              <option value="11">Nov (11)</option>
                              <option value="12">Dec (12)</option>
                            </select>
                            {this.state.errors.expirationMonth && (
                              <div className="invalid-feedback">{this.state.errors.expirationMonth}</div>
                            )}
                          </div>
                          <div className="col-6">
                            <select
                              className={`form-control ${this.state.errors.expirationYear ? 'is-invalid' : ''}`}
                              name="expiry-year"
                              value={this.state.expirationYear}
                              onChange={this.handleExpirationYear}
                            >
                              <option>Year</option>
                              <option value="2020">2024</option>
                              <option value="2021">2025</option>
                              <option value="2022">2026</option>
                              <option value="2023">2027</option>
                            </select>
                            {this.state.errors.expirationYear && (
                              <div className="invalid-feedback">{this.state.errors.expirationYear}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label" htmlFor="cvv">
                        Card CVV
                      </label>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className={`form-control ${this.state.errors.cvv ? 'is-invalid' : ''}`}
                          name="cvv"
                          id="cvv"
                          placeholder="Security Code"
                        />
                        {this.state.errors.cvv && (
                          <div className="invalid-feedback">{this.state.errors.cvv}</div>
                        )}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="col-sm-offset-3 col-sm-9">
                        <button type="submit" className="btn btn-success">
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </fieldset>
                </form>
              </div>
              <div className="col-lg-4 col-sm">
                {storeId && (
                <div className="bopisselected">
                  <div className="alert alert-success">
                    <div className="badge-warning mb-3">
                      <span className="fa fa-lg fa-earth"></span>{" "}
                      BOPIS - BUY ONLINE PICKUP IN STORE
                    </div>
                    <div className="border border-secondary p-2 rounded">
                      <p>
                        Thank you for choosing pickup in store and contributing to our sustainable commerce movement.
                      </p>
                    </div>
                  </div>
                </div>
                )}

                <hr />
                <div className="mb-2 p-1">
                  <span className="fa fa-lg fa-credit-card">                
                  </span> <strong>ACCEPTED PAYMENT METHODS</strong>
                </div>
                <div className="border border-secondary p-2 rounded">
                  <span className="fa fa-cc-amex fa-lg font-weight-lighter"></span>{" "}
                  American Express
                  <br />
                  <span className="fa fa-cc-diners-club fa-lg font-weight-lighter"></span>{" "}
                  Diners Club
                  <br />
                  <span className="fa fa-cc-mastercard fa-lg font-weight-lighter"></span>{" "}
                  Master Card
                  <br />
                  <span className="fa fa-cc-visa fa-lg font-weight-lighter"></span>{" "}
                  Visa
                  <br />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    } else {
      const basketObj = this.state.basket;
      const productObj = this.state.isLoaded && basketObj.productItems[0];
      return (
        <div>
          <Helmet>
            <title>Payment Page</title>
            <meta name="theme-color" content="#ccc" />
          </Helmet>
          <Navbar></Navbar>
          <Footer />
        </div>
      );
    }
  }
}

export default Paymentpage;
