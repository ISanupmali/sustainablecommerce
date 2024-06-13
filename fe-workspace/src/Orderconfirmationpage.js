import React from 'react';
import axios from 'axios';
import Navbar from './components/navbar';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet';
import './App.css';
class OrderConfirmationPage extends React.Component {
    constructor(props) {
		super(props);
		this.state = {
            basketId:props.match.params.id,
            order:[],
            isLoaded:false
        }
    }

    componentWillMount() {
        axios.get(`http://localhost:8080/createorder/` +this.props.match.params.id).then(res =>  {
            const order = res.data;
            this.setState({ order});
            this.setState({isLoaded: true})
            console.log(order);
        });
        const bearerToken = Cookies.get('bearerToken');
		if(bearerToken) {
			Cookies.set('bearerToken', bearerToken, {
				expires: 0
			});
		}
		sessionStorage.removeItem('basketData');
    }

    render() {
        const orderObj = this.state.order;
        const shipmentObj = (this.state.isLoaded && orderObj.shipments[0].shippingAddress);
        const billingObj =(this.state.isLoaded && orderObj.billingAddress);
        const productLineItem = (this.state.isLoaded && orderObj.productItems[0]);
        return (<div>
             <Helmet>
                    <title>Order Confirmation page</title>
                    <meta name="theme-color" content="#ccc" />
            </Helmet>
            <Navbar></Navbar>
            
            <div className="contashipping-heading container mt-4 mb-4">
                <div>
                    <h5><span class="fa fa-truck mb-4"></span> Order Successfully Placed!</h5>
                    <div class="alert alert-info  mt-0">
                        <span>
                            <strong>Your Order is on the Way: </strong> You will receive an email shortly with the shipping details and a link for tracking the order.
                        </span>
                        <blockquote>Thank you for shopping on our Demo Site, we appreciate it. Hope to see you again soon.</blockquote>
                    </div>
                </div>
                 <div className="Order-heading container">
                    <div className="order-text row">
                        <div className="col-12">
                            <h5> Order Details</h5>
                            <span>Order No : {orderObj.orderNo}</span><br />
                            <span> Order Total : {orderObj.orderTotal} </span> <br />
                            <span>Shipping Total : {(orderObj.shippingTotal)} </span>
                        </div>
                    </div>
                    <hr/>
                    <div className="product-info row">
                        <div className="col">
                            <h5>Product Details</h5>
                            <span>Product Name: {(productLineItem.productName)}</span><br />
                            <span>Product ID: {(productLineItem.productId)} </span> <br />     
                            <span>Price: {(productLineItem.price)} </span><br/>
                            <span>Quantity : {(productLineItem.quantity)} </span>  
                        </div>  
                    </div>
                    <hr/> 
                    <div className="row">
                     <div className="col">
                        <h5>Shipping Details</h5>
                        <span>Full Name: {shipmentObj.fullName}</span><br />
                        <span>Address: {shipmentObj.address1}</span><br />
                        <span>Postal Code:: {shipmentObj.postalCode}</span><br />
                        <span>City: {shipmentObj.city}</span><br />
                        <span>State Code: {shipmentObj.stateCode}</span><br />
                        <span>Country Code: {shipmentObj.countryCode}</span>
                     </div>
                     <div className="col">
                        <h5>Billing Details</h5>
                        <span>Full Name: {billingObj.fullName}</span><br />
                        <span>Address: {billingObj.address1}</span><br />
                        <span>Postal Code:: {billingObj.postalCode}</span><br />
                        <span>City: {billingObj.city}</span><br />
                        <span>State Code: {billingObj.stateCode}</span><br />
                        <span>Country Code: {billingObj.countryCode}</span>
                    </div> 
                </div>
                     
                </div>
                    
            </div>
        </div>);
        }
    
}
export default OrderConfirmationPage