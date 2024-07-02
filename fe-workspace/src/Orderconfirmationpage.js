import React from "react";
import axios from "axios";
import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Cookies from "js-cookie";
import { Helmet } from "react-helmet";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

class OrderConfirmationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basketId: props.match.params.id,
      order: [],
      isLoaded: false,
      bearerToken: "",
      token: '',
      headers: "",
      inThirtyMinutes: new Date(new Date().getTime() + 30 * 60 * 1000),
    };
  }

  async placeOrder(headers) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/createorder/` + this.props.match.params.id,
        { headers: headers }
      );
      return res.data;
    } catch (error) {
      console.error("Error placing an Order", error);
      window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
    }
  }

  async updateOrderStatus (orderNo) {
    axios.get(`${process.env.REACT_APP_API_URL}/get-accesstoken`)
      .then(async res => {
          console.log('[FE]Storeportal.js :: Admin Token Response: ' + JSON.stringify(res));
          if (res.status === 200) {
              const authheaders = {
                "Content-Type": "application/json",
                Authorization: "Bearer " +res.data,
              };
              try {
                const res = await axios.post(
                  `${process.env.REACT_APP_API_URL}/updatestatus/` + orderNo,
                  { data: '' },
                  { headers: authheaders }
                );
                return res.data;
              } catch (error) {
                console.error("Error updating Order Status", error);
                /* Not needed to redirect to error for just order status update 
                window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
                */
              }
          } else {
              console.log('[FE]Storeportal.js :: Error occurred While fetching Admin access token: ' + JSON.stringify(res));
          }
      })
      .catch(error => {
          console.log('[FE]Storeportal.js :: Error While fetching Admin access token: ' + error);
          window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
      });
    
  }

  async componentDidMount() {
    const bearerToken = Cookies.get("bearerToken");
    const inThirtyMinutes = 1 / 48;

    if (!bearerToken) {
      axios.get(`${process.env.REACT_APP_API_URL}/shopper/auth/guest`).then(async (res) => {
        const bearerToken = res.data;
        Cookies.set("bearerToken", bearerToken, {
          expires: inThirtyMinutes,
        });
        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + bearerToken,
        };
        this.setState({ headers });
        const placeOrderResult = await this.placeOrder(headers);
        if (placeOrderResult) {
          const order = placeOrderResult;
          setTimeout(() => {
            this.setState({ order, isLoaded: true });
          }, 3000); // 3 seconds delay
          this.updateOrderStatus(placeOrderResult.orderNo);
        }
      });
    } else {
      const headers = {
        "Content-Type": "application/json",
        Authorization: "Bearer " + bearerToken,
      };
      this.setState({ headers });
      const placeOrderResult = await this.placeOrder(headers);
      if (placeOrderResult) {
        const order = placeOrderResult;
        setTimeout(() => {
          this.setState({ order, isLoaded: true });
        }, 3000); // 3 seconds delay
        sessionStorage.removeItem("basketData");
        Cookies.set("bearerToken", bearerToken, {
          expires: 0,
        });
        this.updateOrderStatus(placeOrderResult.orderNo);
      }
    }
  }

  /**
     * Get admin access token and set it in cookie and token variable
     */
  getAdminAuthToken() {
    const inThirtyMinutes = 1 / 48;
    axios.get(`${process.env.REACT_APP_API_URL}/get-accesstoken`)
      .then(res => {
          if (res.status === 200) {
              this.setState({ token: res.data });
              Cookies.set("accessToken", res.data, {
                  expires: inThirtyMinutes,
                });
          } else {
              console.log('[FE]Storeportal.js :: Error occurred While fetching Admin access token: ' + JSON.stringify(res));
          }
      })
      .catch(error => {
          console.log('[FE]Storeportal.js :: Error While fetching Admin access token: ' + error);
          window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
      });
  }

  render() {
    const { isLoaded, order } = this.state;
    const shipmentObj = isLoaded && order.shipments[0].shippingAddress;
    const billingObj = isLoaded && order.billingAddress;
    const productLineItem = isLoaded && order.productItems[0];

    return (
      <div>
        <Helmet>
          <title>Order Confirmation page</title>
          <meta name="theme-color" content="#ccc" />
        </Helmet>
        <Navbar />

        {!isLoaded && (
          <div className="loading-message">
            <div className="loading-text">
              Placing your order. Do not navigate away from this page.
            </div>
          </div>
        )}

        {isLoaded && (
          <div className="contashipping-heading container mt-4 mb-4">
            <div>
              <h5>
                <span className="fa fa-truck mb-4"></span> Order Successfully Placed!
              </h5>
              <div className="alert alert-info mt-0">
                <span>
                  <strong>Your Order is on the Way: </strong> You will receive an email shortly with the shipping details and a link for tracking the order.
                </span>
                <blockquote>
                  Thank you for shopping on our Demo Site, we appreciate it. Hope to see you again soon.
                </blockquote>
              </div>
            </div>
            <div className="Order-heading container">
              <div className="order-text row">
                <div className="col-12">
                  <h5> Order Details</h5>
                  <span>Order No : {order.orderNo}</span>
                  <br />
                  <span> Order Total : {order.orderTotal} </span> <br />
                  <span>Shipping Total : {order.shippingTotal} </span>
                </div>
              </div>
              <hr />
              <div className="product-info row">
                <div className="col">
                  <h5>Product Details</h5>
                  <span>Product Name: {productLineItem.productName}</span>
                  <br />
                  <span>Product ID: {productLineItem.productId} </span> <br />
                  <span>Price: {productLineItem.price} </span>
                  <br />
                  <span>Quantity : {productLineItem.quantity} </span>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col">
                  <h5>Shipping Details</h5>
                  <span>Full Name: {shipmentObj.fullName}</span>
                  <br />
                  <span>Address: {shipmentObj.address1}</span>
                  <br />
                  <span>Postal Code: {shipmentObj.postalCode}</span>
                  <br />
                  <span>City: {shipmentObj.city}</span>
                  <br />
                  <span>State Code: {shipmentObj.stateCode}</span>
                  <br />
                  <span>Country Code: {shipmentObj.countryCode}</span>
                </div>
                <div className="col">
                  <h5>Billing Details</h5>
                  <span>Full Name: {billingObj.fullName}</span>
                  <br />
                  <span>Address: {billingObj.address1}</span>
                  <br />
                  <span>Postal Code: {billingObj.postalCode}</span>
                  <br />
                  <span>City: {billingObj.city}</span>
                  <br />
                  <span>State Code: {billingObj.stateCode}</span>
                  <br />
                  <span>Country Code: {billingObj.countryCode}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

export default OrderConfirmationPage;