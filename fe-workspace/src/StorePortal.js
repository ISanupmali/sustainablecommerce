import React from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

const inThirtyMinutes = 1 / 48;
const cookieName = 'accessToken';

/**
 * Component for managing and displaying store portal functionality.
 */
class StorePortal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            orderNo: '',
            orderObj: null,
            orderFound: false,
            token: '',
            loading: false,
        };
    }

    /**
     * Alert user of winning in spin wheel.
     */
    handleSpinWheel = () => {
        alert('Congrats you are a lucky customer !!');
    };

    /**
     * Alert user of not winning in squart.
     */
    handleSquart = (event) => {
        event.preventDefault();
        alert('Better Luck Next Time !!');
    };

    /**
     * Alert user of not winning in qr scan.
     */
    handleQrScan = (event) => {
        event.preventDefault();
        alert('Better Luck Next Time !!');
    };

    /**
     * Fetches admin access token on component mount.
     */
    componentDidMount() {
        this.getAdminAuthToken();
    }

    /**
     * Get admin access token and set it in cookie and token vriable
     */
    getAdminAuthToken() {
        axios.get(`http://localhost:8080/get-accesstoken`)
            .then(res => {
                console.log('[FE]Storeportal.js :: Admin Token Response: ' + JSON.stringify(res));
                if (res.status === 200) {
                    this.setState({ token: res.data });
                    Cookies.set(cookieName, res.data, {
                        expires: inThirtyMinutes,
                      });
                } else {
                    console.log('[FE]Storeportal.js :: Error occurred While fetching Admin access token: ' + JSON.stringify(res));
                }
            })
            .catch(error => {
                console.log('[FE]Storeportal.js :: Error While fetching Admin access token: ' + error);
                window.location.href = "http://localhost:3000/errorpage";
            });
    }

    /**
     * Handles form submission to retrieve order details.
     */
    handleSubmission = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const cookieTokenValue = Cookies.get(cookieName);
        if (!cookieTokenValue) {
            this.getAdminAuthToken();
        }
        axios.post(`http://localhost:8080/getOrder`, {
            body: {
                orderNo: this.state.orderNo,
                token: 'Bearer ' + this.state.token
            }
        })
            .then(res => {
                console.log('[FE]Storeportal.js :: getOrder Response:' + JSON.stringify(res));
                if (res.data === '404 Not Found') {
                    this.initializeState('Order Not Found!', false, null);
                } else if (res.data && res.data.orderNo) {
                    this.initializeState('Order Found', true, res.data);
                } else {
                    this.initializeState('Order Not Found!', false, null);
                }
            })
            .catch(err => {
                if (err.response && err.response.status === 404) {
                    this.initializeState('Order Not Found!', false, null);
                } else {
                    this.initializeState('Error occurred: ' + err.message, false, null);
                }
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    /**
     * Initializes component state based on API response.
     */
    initializeState = (msg, orderFound, orderObj) => {
        this.setState({
            msg: msg,
            orderObj: orderObj,
            orderFound: orderFound
        });
    };

    /**
     * Updates state with order number input value.
     */
    handleOrderNo = (event) => {
        this.setState({ orderNo: event.target.value });
    };

    /**
     * Renders the StorePortal component.
     */
    render() {
        const { msg, orderObj, orderFound, loading } = this.state;

        // Extracting data for display if order is found
        const billingObj = orderFound && orderObj && orderObj.billingAddress;
        const productLineItem = orderFound && orderObj && orderObj.productItems[0];
        const shipmentObj = orderFound && orderObj && orderObj.shipments[0] && orderObj.shipments[0].shippingAddress;

        return (
            <div>
                <Helmet>
                    <title>Store Portal</title>
                    <meta name="theme-color" content="#ccc" />
                </Helmet>
                <section className="1">
                    <div className="container px-4 px-lg-5 my-5">
                        <div className="jumbotron">
                            <h1 className="display-7">Welcome to Store Portal</h1>
                            <hr className="my-4" />
                            <p>Please enter order details.</p>
                            <form onSubmit={this.handleSubmission}>
                                <fieldset>
                                    <div className="form-group">
                                        <label className="col-sm-3 control-label" htmlFor="orderno">Order Number</label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control" name="orderno" id="orderid" placeholder="Order Number" required value={this.state.orderNo} onChange={this.handleOrderNo} />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginTop: '20px'}}>
                                        <div className="col-sm-offset-3 col-sm-9">
                                            <button type="submit" className="btn btn-success">Search</button>
                                        </div>
                                    </div>
                                </fieldset>
                            </form>
                            {loading ? (
                                <div className="spinner-border" role="status" style={{ marginTop: '20px', marginBottom: '20px' }}>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <div style={{ marginTop: '20px', fontSize: '18px' }}>
                                    {orderFound && orderObj ? (
                                        <div>
                                            <div className="order-text row">
                                                <div className="col-12">
                                                    <h5> Order Details</h5>
                                                    <span>Order No : {orderObj.orderNo}</span><br />
                                                    <span> Order Total : {orderObj.orderTotal} </span> <br />
                                                    <span>Shipping Total : {(orderObj.shippingTotal)} </span>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="customer-text row">
                                                <div className="col-12">
                                                    <h5> Customer Details</h5>
                                                    <span>Customer No : {orderObj.customerInfo && orderObj.customerInfo.customerNo}</span><br />
                                                    <span>Customer Name : {orderObj.customerInfo && orderObj.customerInfo.customerName} </span> <br />
                                                    <span>Email : {(orderObj.customerInfo && orderObj.customerInfo.email)} </span>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="product-info row">
                                                <div className="col">
                                                    <h5>Product Details</h5>
                                                    <span>Product Name: {(productLineItem.productName)}</span><br />
                                                    <span>Product ID: {(productLineItem.productId)} </span> <br />
                                                    <span>Price: {(productLineItem.price)} </span><br />
                                                    <span>Quantity : {(productLineItem.quantity)} </span>
                                                </div>
                                            </div>
                                            <hr />
                                            <div className="row">
                                                <div className="col">
                                                    <h5>Shipping Details</h5>
                                                    <span>Full Name: {shipmentObj.fullName}</span><br />
                                                    <span>Address: {shipmentObj.address1}</span><br />
                                                    <span>Postal Code: {shipmentObj.postalCode}</span><br />
                                                    <span>City: {shipmentObj.city}</span><br />
                                                    <span>State Code: {shipmentObj.stateCode}</span><br />
                                                    <span>Country Code: {shipmentObj.countryCode}</span>
                                                </div>
                                                <div className="col">
                                                    <h5>Billing Details</h5>
                                                    <span>Full Name: {billingObj.fullName}</span><br />
                                                    <span>Address: {billingObj.address1}</span><br />
                                                    <span>Postal Code: {billingObj.postalCode}</span><br />
                                                    <span>City: {billingObj.city}</span><br />
                                                    <span>State Code: {billingObj.stateCode}</span><br />
                                                    <span>Country Code: {billingObj.countryCode}</span>
                                                </div>
                                            </div>
                                            <br />
                                            <hr />
                                            <div className="row">
                                                <div className="col-sm-4">
                                                    <Link to="/spinwheel">
                                                        <button className="btn btn-primary btn-sm" onClick={this.handleSpinWheel}>Go to Spin Wheel</button>
                                                    </Link>
                                                </div>
                                                <div className="col-sm-4">
                                                    <Link to="/spinwheel">
                                                        <button className="btn btn-primary btn-sm" onClick={this.handleQrScan}>Scan Vehicle QR</button>
                                                    </Link>
                                                </div>
                                                <div className="col-sm-4">
                                                    <Link to="/spinwheel">
                                                        <button className="btn btn-primary btn-sm" onClick={this.handleSquart}>Go to Squart</button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : msg ? (
                                        <div className="alert alert-danger">
                                            <strong>{msg}</strong> Please try again.
                                        </div>
                                    ) : (
                                        <p>Click "Search" to retrieve data.</p>
                                    )}
                                </div>
                            )}
                            <br />
                            <p className="lead">
                                <a className="btn btn-primary btn-sm" href="/" role="button">Navigate to Storefront</a>
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default StorePortal;
