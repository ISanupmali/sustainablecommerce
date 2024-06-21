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
    };
  }

  handleCardType = (event) => {
    this.setState({
      cardType: event.target.value,
    });
  };
  handleExpirationMonth = (event) => {
    this.setState({
      expirationMonth: event.target.value,
    });
  };
  handleExpirationYear = (event) => {
    this.setState({
      expirationYear: event.target.value,
    });
  };
  handleCardHolder = (event) => {
    this.setState({
      cardHolder: event.target.value,
    });
  };
  handleCardNumber = (event) => {
    this.setState({
      cardNumber: event.target.value,
    });
  };
  handleTotalAmount = (event) => {
    this.setState({
      totalAmount: event.target.value,
    });
  };

  handleSubmission = (event) => {
    var mask = MaskedCardNumber(this.state.cardNumber);
    const urlParams = new URLSearchParams(this.props.location.search);
    const orderTotal = urlParams.get("orderTotal");
    this.setState({ submitted: true });
    const basketObj = this.state.basket;
    console.log(orderTotal);
    //  const orderTotal = basketObj.orderTotal != null ? basketObj.orderTotal : '';
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/addpaymentinstrument/` +
          this.state.basketId,
        {
          params: {
            cardType: this.state.cardType,
            expirationMonth: this.state.expirationMonth,
            expirationYear: this.state.expirationYear,
            holder: this.state.cardHolder,
            maskedNumber: mask,
            orderTotal: orderTotal,
            headers: this.state.headers,
          },
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
    if (this.state.submitted === false) {
      return (
        <div>
          <Helmet>
            <title>Payment page</title>
            <meta name="theme-color" content="#ccc" />
          </Helmet>
          <Navbar></Navbar>
          <div className="contashipping-heading container mb-5">
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
                  <fieldset>
                    <div className="form-group">
                      <label className="col-sm-3 control-label" for="card-type">
                        Card Type
                      </label>
                      <div className="col-sm-9">
                        <select
                          className="form-control col-sm-12"
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
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className="col-sm-3 control-label"
                        for="card-holder-name"
                      >
                        Name on Card
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="card-holder-name"
                          id="card-holder-name"
                          placeholder="Card Holder's Name"
                          value={this.state.cardHolder}
                          onChange={this.handleCardHolder}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className="col-sm-3 control-label"
                        for="card-number"
                      >
                        Card Number
                      </label>
                      <div className="col-sm-9">
                        <input
                          type="text"
                          className="form-control"
                          name="card-number"
                          id="card-number"
                          placeholder="Debit/Credit Card Number"
                          value={this.state.cardNumber}
                          onChange={this.handleCardNumber}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label
                        className="col-sm-3 control-label"
                        for="expiry-month"
                      >
                        Expiration Date
                      </label>
                      <div className="col-sm-9">
                        <div className="row">
                          <div className="col-6">
                            <select
                              className="form-control col-sm-12"
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
                          </div>
                          <div className="col-6">
                            <select
                              className="form-control"
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
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="col-sm-3 control-label" for="cvv">
                        Card CVV
                      </label>
                      <div className="col-sm-3">
                        <input
                          type="text"
                          className="form-control"
                          name="cvv"
                          id="cvv"
                          placeholder="Security Code"
                        />
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
                <div className="badge badge-warning">
                  <span className="fa fa-lg fa-exclamation-triangle"></span>{" "}
                  IN-STORE PICKUP NOT AVAILABLE
                </div>
                <div className="border border-secondary p-2 rounded">
                  <p>
                    We regret to inform you that instore pickup is not available
                    in your area. Enter your address to get your order at your
                    doorstep.
                  </p>
                </div>
                <hr />
                <div className="mb-2 p-1">
                  <span className="fa fa-lg fa-credit-card">
                    ACCEPTED PAYMENT METHODS
                  </span>
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
          <div className="contashipping-heading container card bg-white">
            <div className="row">
              <div className="col-1">
                <Spinner animation="border" size="lg" />
              </div>
              <div className="col-11">
                <h3>Placing Your Order</h3>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      );
    }
  }
}
export default Paymentpage;
