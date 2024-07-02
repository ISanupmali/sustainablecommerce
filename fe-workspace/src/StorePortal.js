import React from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import './StorePortal.css'; // Import the custom CSS file
import Card from 'react-bootstrap/Card';
const inThirtyMinutes = 1 / 48;
const cookieName = 'accessToken';

class StorePortal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            orderNo: '',
            postalCode: '',
            orderObj: null,
            orderFound: false,
            token: '',
            loading: false,
        };
    }

    handleSpinWheel = () => {
        alert('Congrats you are a lucky customer !!');
    };

    handleSquart = (event) => {
        event.preventDefault();
        alert('Better Luck Next Time !!');
    };

    handleQrScan = (event) => {
        event.preventDefault();
        alert('Better Luck Next Time !!');
    };

    componentDidMount() {
        this.getAdminAuthToken();
    }

    getAdminAuthToken() {
        axios.get(`http://localhost:8080/get-accesstoken`)
            .then(res => {
                console.log('[FE]Storeportal.js :: Admin Token Response: ' + JSON.stringify(res));
                if (res.status === 200) {
                    this.setState({ token: res.data });
                    Cookies.set(cookieName, res.data, { expires: inThirtyMinutes });
                } else {
                    console.log('[FE]Storeportal.js :: Error occurred While fetching Admin access token: ' + JSON.stringify(res));
                }
            })
            .catch(error => {
                console.log('[FE]Storeportal.js :: Error While fetching Admin access token: ' + error);
                window.location.href = "http://localhost:3000/errorpage";
            });
    }

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
                console.log('[FE]Storeportal.js :: getOrder Response: ' + JSON.stringify(res));
                const msg = res && res.data && res.data.msg ? res.data.msg : 'Order Not Found!';
                if (res.data && res.data.data) {
                    const shipments = res.data.data.shipments && res.data.data.shipments[0] ? res.data.data.shipments[0] : '';
                    const postalCode = shipments && shipments.shippingAddress.postalCode ? shipments.shippingAddress.postalCode : '';
                    if (this.state.postalCode === postalCode) {
                        this.initializeState(msg, true, res.data.data);
                    } else {
                        this.initializeState('Invalid Input!', false, null);
                    }
                } else {
                    this.initializeState(msg, false, null);
                }
            })
            .catch(err => {
                console.log('[FE]Storeportal.js :: Exception: ' + err);
                if (err.response && err.response.status === 404) {
                    this.initializeState('Order Not Found!', false, null);
                } else {
                    this.initializeState('Exception occurred!' + false, null);
                }
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    initializeState = (msg, orderFound, orderObj) => {
        this.setState({
            msg: msg,
            orderObj: orderObj,
            orderFound: orderFound
        });
    };

    handleOrderNo = (event) => {
        this.setState({ orderNo: event.target.value });
    };

    handlePostalCode = (event) => {
        this.setState({ postalCode: event.target.value });
    };

    render() {
        const { msg, orderObj, orderFound, loading } = this.state;

        const billingObj = orderFound && orderObj && orderObj.billingAddress;
        const productLineItem = orderFound && orderObj && orderObj.productItems[0];
        const shipmentObj = orderFound && orderObj && orderObj.shipments[0] && orderObj.shipments[0].shippingAddress;

        return (
            <div className="store-portal">
                <Helmet>
                    <title>Delivery Centre - Store Portal</title>
                    <meta name="theme-color" content="#ccc" />
                </Helmet>
                <section className="section">
                    <div className="container">
                        <div className="jumbotron">
                            
                            <h1 className="display-4 text-center">Delivery Centre - Store Portal</h1>
                            <hr className="my-4" />
                            
                            <div className="row">
                                <div className="col-6 mx-auto">
                                    <Card>
                                        <Card.Header>Please enter the order number and the associated zip code to fetch the details of the order</Card.Header>
                                        <Card.Body>
                                            <Card.Text>
                                                <form onSubmit={this.handleSubmission}>
                                                    <fieldset>
                                                        <div className="form-group">
                                                            <div className="col-12">
                                                                <input type="text" className="form-control" name="orderno" id="orderid" placeholder="Order Number" required value={this.state.orderNo} onChange={this.handleOrderNo} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group mt-3">
                                                            <div className="col-12">
                                                                <input type="text" className="form-control" name="postalCode" id="postalCode" placeholder="Postal Code" required value={this.state.postalCode} onChange={this.handlePostalCode} />
                                                            </div>
                                                        </div>
                                                        <div className="form-group" style={{ marginTop: '20px'}}>
                                                            <div className="col-12">
                                                                <button type="submit" className="btn btn-success w-100">Search</button>
                                                            </div>
                                                            <p className="small mt-3 text-center">Click "Search" to Get Order details.</p>
                                                        </div>
                                                    </fieldset>
                                                </form>
                                            </Card.Text>
                                            
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>

                            
                            {loading ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            ) : (
                                <div className="order-details">
                                    {orderFound && orderObj ? (
                                        <div>

                                            <div class="row justify-content-center">
                                                <div class="col info-box rounded col-lg-10 col-xl-8 bg-light p-4 m-3 ">
                                                    <div class="row ">
                                                        <div class="col-12 col-sm-2 d-flex justify-content-center align-items-center mb-2 mb-sm-0 display-3 text-primary">
                                                            <i class="fa fa-check"></i>
                                                        </div>
                                                        <div class="col-12 col-sm-10 pl-sm-0 mb-2">
                                                            <div class="col-md-12">
                                                                <div class="panel panel-info">
                                                                    <div class="panel-heading">
                                                                        <h4 class="text-center">
                                                                        VALID ORDER - {orderObj.orderNo}</h4>
                                                                    </div>
                                                                    <div class="panel-body">
                                                                        <p class="lead">
                                                                            <strong>Order Total: {orderObj.orderTotal}</strong><br/>
                                                                            Shipping Total: {orderObj.shippingTotal}
                                                                            </p>
                                                                    </div>
                                                                    <ul class="list-group list-group-flush">
                                                                        <li class="list-group-item">Product Name: {productLineItem.productName}</li>
                                                                        <li class="list-group-item">Quantity: {productLineItem.quantity}</li>
                                                                    </ul>
                                                                    <hr/>
                                                                    <ul class="list-group list-group-flush">
                                                                        <li class="list-group-item">Full Name: {billingObj.fullName}</li>
                                                                        <li class="list-group-item">Address: {billingObj.address1}</li>
                                                                        <li class="list-group-item">Postal Code: {billingObj.postalCode}</li>
                                                                        <li class="list-group-item">State Code: {billingObj.stateCode}</li>
                                                                        <li class="list-group-item">Country Code: {billingObj.countryCode}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="alert alert-success mt-2" role="alert">
                                                        <p>The customer's order can be handed over to him/her. <br/>
                                                        If the customer has used a green mode of transportationm let him/her choose from the following options to get a discount coupon for his next order.</p>
                                                    </div>
                                                    <div class="row">
                                                        <div className="btn-group mt-4">
                                                            <Link to="/spinwheel" className="btn btn-warning"><i class="fa-solid fa-spinner"></i> Spin Wheel Game</Link>
                                                            <Link to="/scanqr" className="btn btn-success"><i class="fa-solid fa-qrcode"></i> Scan Bus QR</Link>
                                                            <Link to="/squatsgame" className="btn btn-danger"><i class="fa-solid fa-person-walking"></i> 10 Squats Challenge</Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : msg ? (
                                        <div className="alert alert-danger mt-4">
                                            <strong>{msg}</strong> Please try again.
                                        </div>
                                    ) : (
                                        <p className="mt-4"></p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

export default StorePortal;
