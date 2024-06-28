import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./App.css"; // Ensure to import the CSS file

class Cartpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basket: [],
      productItemsArr: [],
      showPopup: true, // Control the visibility of the popup
    };
  }

  getProductImage = (productId, basketData) => {
    const item = basketData.products.find((item) => item.productId === productId);
    return item.imgUrl;
  };

  async fetchCartInfo(headers) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/baskets/` + this.props.match.params.id,
        { headers: headers }
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching cart info", error);
      window.location.href = `/carterror`;
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
          this.setState({ bearerToken });
          try {
            const headers = {
              "Content-Type": "application/json",
              Authorization: "Bearer " + bearerToken,
            };
            const basket = await this.fetchCartInfo(headers);
            if (basket) {
              this.setState({ basket, productItemsArr: basket.productItems });
            }
          } catch (error) {
            console.error("Error fetching basket info", error);
            window.location.href = `/carterror`;
          }
        })
        .catch((error) => {
          console.error("Error fetching guest auth token:", error);
          window.location.href = `/errorpage`;
        });
    } else {
      try {
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + bearerToken,
        };
        const basket = await this.fetchCartInfo(headers);
        if (basket) {
          this.setState({ basket, productItemsArr: basket.productItems });
        }
      } catch (error) {
        console.error("Error fetching basket info", error);
        window.location.href = `/carterror`;
      }
    }
  }

  closePopup = () => {
    this.setState({ showPopup: false });
  };

  render() {
    const { basket, productItemsArr, showPopup } = this.state;
    const basketData = sessionStorage.getItem("basketData")
      ? JSON.parse(sessionStorage.getItem("basketData"))
      : "";

    return (
      <div>
        <Helmet>
          <title>Your Cart</title>
          <meta name="theme-color" content="#ccc" />
        </Helmet>
        <Navbar />

        {showPopup && (
          <div className="popup-background" onClick={this.closePopup}>
            <div className="popup-content">
              <span className="popup-close" onClick={this.closePopup}>&times;</span>
              <div className="bopis-message">
                <div className="bopis-text">
                  Opt for BOPIS - Pick-up in Store and use any green mode of transportation to avail exciting offers at the Pick-up Counter.
                  <br/><br/><br/>
                  <i class="fa-solid fa-charging-station fa-5x"></i> or <i class="fa-solid fa-person-biking fa-5x"></i> or <i class="fa-solid fa-bus fa-5x"></i>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container">
          <div className="row mt-5 mb-2 p-3 my-3 alert alert-success">
            <div className="col col-lg-9 col-sm-8">
              <h5>
                <span className="fa fa-shopping-cart"></span> Your Cart
              </h5>
            </div>
            <div className="col col-lg-3 col-sm-4">
              <Link to="/" className="btn btn-warning btn-sm btn-block" role="button">
                <span className="glyphicon glyphicon-share-alt"></span> Continue shopping
              </Link>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 col-sm-12">
              {productItemsArr.map((PLI) => (
                <div className="row mt-5" key={PLI.productId}>
                  <div className="col col-lg-8">
                    <div className="col-12">
                      <img
                        className="img-responsive cartimg"
                        src={this.getProductImage(PLI.productId, basketData)}
                        alt={PLI.productName}
                      />
                      <p className="product-name">
                        <strong>{PLI.productName}</strong>
                        <br />
                        <small>{PLI.productId}</small>
                      </p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="row">
                      <div className="col-6">
                        <strong>
                          ${parseFloat(PLI.price).toFixed(2)}{" "}
                          <span className="text-muted">x</span>
                        </strong>
                      </div>
                      <div className="col-6">
                        <input type="text" className="form-control input-sm" value="1" readOnly />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-4 col-sm-12">
              <div className="row mb-4">
                <div className="col-lg-12 col-sm-12">
                  <div className="alert alert-info">
                    <p className="text-uppercase mb-2">
                      BOPIS - PICUP IN STORE
                    </p>
                    <br />
                    <span className="fa fa-cc-amex fa-lg font-weight-lighter"></span> American Express
                    <br />
                    <span className="fa fa-cc-diners-club fa-lg font-weight-lighter"></span> Diners Club
                    <br />
                    <span className="fa fa-cc-mastercard fa-lg font-weight-lighter"></span> Master Card
                    <br />
                    <span className="fa fa-cc-visa fa-lg font-weight-lighter"></span> Visa
                    <br />
                  </div>
                </div>
                <div className="col-lg-12 col-sm-12">
                  <div className="alert alert-info">
                    <p className="text-right font-weight-lighter">
                      Product Sub Total:{" "}
                      <strong>${parseFloat(basket.productSubTotal).toFixed(2)}</strong>
                      <br />
                      Adjusted Total Tax:{" "}
                      <strong>${basket.adjustedMerchandizeTotalTax}</strong>
                      <br />
                      Total: <strong>${parseFloat(basket.productTotal).toFixed(2)}</strong>
                      <br />
                    </p>
                    <div className="form-check mb-1 small">
                      <input className="form-check-input" type="checkbox" id="tnc" />
                      <label className="form-check-label" htmlFor="tnc">
                        I agree to the <a href="#">terms and conditions</a>
                      </label>
                    </div>
                    <div className="form-check mb-3 small">
                      <input className="form-check-input" type="checkbox" id="subscribe" />
                      <label className="form-check-label" htmlFor="subscribe">
                        Get emails about product updates and events. If you change your mind, you can unsubscribe at any time.{" "}
                        <a href="#">Privacy Policy</a>
                      </label>
                    </div>
                    <Link className="btn btn-primary w-100 mt-2" to={"/shipment/" + this.props.match.params.id}>
                      Continue to Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }
}

export default Cartpage;
