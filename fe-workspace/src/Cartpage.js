import React from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import "./App.css"; // Ensure to import the CSS file
import CartTotal from "./components/CartTotal";
const inThirtyMinutes = 1 / 48;

class Cartpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basket: [],
      productItemsArr: [],
      storeResult: [],
      submitted: false,
      zipCode: '',
      showPopup: true, // Control the visibility of the store selection popup
      showStoreSelectedPopup: false, // Control the visibility of the store selected popup
    };
  }

  getProductImage = (productId, basketData) => {
    const item = basketData.products.find((item) => item.productId === productId);
    return item.imgUrl;
  };

  handleZipCode = (event) => {
    this.setState({
      zipCode: event.target.value
    });
  }

  handleSubmission = (event) => {
    event.preventDefault();
    var params = {
      zip: this.state.zipCode,
    };
    console.log("Inside Store");
    this.setState({ submitted: true });
    axios.get(`${process.env.REACT_APP_API_URL}/store`, {
      params: params,
      headers: this.state.headers
    })
      .then(res => {
        if (res.data === '404 Not Found') {
          this.initializeState('Store Not Found!', false, null);
        } else if (res.data && res.data.data) {
          const storeResult = res.data.data;
          this.setState({ storeResult });
          this.initializeState('Stores Found', true, storeResult);
        } else {
          this.initializeState('Store Not Found!', false, null);
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 404) {
          this.initializeState('Store Not Found!', false, null);
        } else {
          this.initializeState('Error occurred: ' + err.message, false, null);
        }
      });
  }

  initializeState = (msg, storeFound, storeResult) => {
    this.setState({
      msg: msg,
      storeFound: storeFound,
      storeResult: storeResult
    });
  };

  handleAddStore = (event) => {
    console.log("Values1", Cookies.get('storeId'));
    const storeId = event.currentTarget.getAttribute("value1");
    const storeName = event.currentTarget.getAttribute("value2");
    const storeAddress = event.currentTarget.getAttribute("value3");
    const storeCity = event.currentTarget.getAttribute("value4");
    Cookies.set('storeId', storeId, {
      expires: inThirtyMinutes,
    });
    Cookies.set('storeName', storeName, {
      expires: inThirtyMinutes,
    });
    Cookies.set('storeAddress', storeAddress, {
      expires: inThirtyMinutes,
    });
    Cookies.set('storeCity', storeCity, {
      expires: inThirtyMinutes,
    });
    this.setState({ showStoreSelectedPopup: true }); // Show store selected popup
    setTimeout(() => {
      this.setState({ showStoreSelectedPopup: false });
    }, 2000); // Hide the popup after 2 seconds
  }

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
    console.log("Values Store id", Cookies.get('storeId'));
    console.log("Values Store name", Cookies.get("storeCity"));

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
            this.setState({ headers });
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
        this.setState({ headers });
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
    const { basket, productItemsArr, showPopup, showStoreSelectedPopup } = this.state;
    const basketData = sessionStorage.getItem("basketData")
      ? JSON.parse(sessionStorage.getItem("basketData"))
      : "";
    const submitted = this.state.submitted;
    const storeFound = this.state.storeFound;

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
                  <br /><br /><br />
                  <i className="fa-solid fa-charging-station fa-5x"></i> or <i className="fa-solid fa-person-biking fa-5x"></i> or <i className="fa-solid fa-bus fa-5x"></i>
                  <br/><br/><br/>
                  With every In-Store Delivery, we could save as much as 100 grams of plastic waste. 
                  <br/>So let's contribute in making our planet <i class="fa-solid fa-earth-americas"></i> a better place.
                </div>
              </div>
            </div>
          </div>
        )}

        {showStoreSelectedPopup && (
          <div className="store-selected-popup">
            Store has been selected successfully!
          </div>
        )}

        <div className="container">
          <div className="row mt-5 mb-2 p-3 my-3 alert alert-success">
            <div className="col col-lg-9 col-sm-8">
              <h5>
                <span className="fa fa-shopping-cart"></span> Your Cart
              </h5>
            </div>
            <div className="col col-lg-3 col-sm-4 text-end">
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
                      BOPIS - PICKUP IN STORE
                    </p>
                    <br />

                    {Cookies.get('storeId') === undefined ? (submitted && storeFound ? (
                      <div className="row">
                        <section className="py-5 bg-light">
                          <div className="container px-4 px-lg-5 mt-5">
                            <h5 className="fw-bolder mb-4">Store Details</h5>
                            <div className="row">
                              {this.state.storeResult.map(store =>
                                <div className="col col-lg-8" key={store.storeid}>
                                  <div className="col-12">
                                    <span>Store Name : {store.name}</span><br />
                                    <span>Store Address : {store.address1}</span><br />
                                    <span>Store City : {store.city}</span><br />
                                  </div>
                                  <button className="btn btn-primary mt-2 flex-shrink-0" type="button" onClick={this.handleAddStore} value1={store.id} value2={store.name} value3={store.address1} value4={store.city}>
                                    Select Store
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </section>
                      </div>) : (
                        <form onSubmit={this.handleSubmission}>
                          <div className="form-group">
                            <div className="col-lg-8 col-sm-8">
                              <p>Enter Zip Code to Select Store</p>
                              <input className="form-control mb-4" placeholder="Zip Code" type="text" name="zipCode" value={this.state.zipCode} onChange={this.handleZipCode} />
                            </div>
                          </div>
                          <div className="row mb-4">
                            <div>
                              <button type="submit" className="btn btn-primary mt-2">Submit</button>
                            </div>
                          </div>
                          {!storeFound && submitted ? (
                            <div className="col-12">
                              <span>Store Not Found. Please try again.</span><br />
                            </div>
                          ) : (
                            <div className="col-12">
                              <span>It will display store details for the provided zip code</span><br />
                            </div>
                          )}
                        </form>)) : (
                      <div className="row">
                        <div className="col col-lg-8" >
                          <div className="col-12">
                            <span>Store Name : {Cookies.get('storeName')}</span><br />
                            <span>Store Address : {Cookies.get('storeAddress')}</span><br />
                            <span>Store City : {Cookies.get('storeCity')}</span><br />
                          </div>
                        </div>
                      </div>)}
                  </div>
                </div>
                <div className="col-lg-12 col-sm-12">
                  <div className="alert alert-info">
                    <CartTotal basket={basket} />
                    <div className="form-check mb-1 small mt-3">
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