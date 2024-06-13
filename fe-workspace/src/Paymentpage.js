import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/navbar';
import MaskedCardNumber from './components/maskedcardnumber';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';

class Paymentpage  extends React.Component {

    constructor(props) {
		super(props);
		this.state = {
			cardType: '',
			expirationMonth: '',
			expirationYear: '',
            cardHolder: '',
            cardNumber: '',
            totalAmount: '',
            basketId:props.match.params.id,
            basket: [],
            submitted: false,
            isLoaded:false
		}
	}

    handleCardType = (event) =>{
        this.setState({
            cardType:event.target.value
        })
    }
    handleExpirationMonth = (event) =>{
        this.setState({
            expirationMonth:event.target.value
        })
    }
    handleExpirationYear = (event) =>{
        this.setState({
            expirationYear:event.target.value
        })
    }
    handleCardHolder = (event) =>{
        this.setState({
            cardHolder:event.target.value
        })
    }
    handleCardNumber = (event) =>{
        this.setState({
            cardNumber:event.target.value
        })
    }
    handleTotalAmount = (event) =>{
        this.setState({
            totalAmount:event.target.value
        })
    }

    handleSubmission = (event) =>{
        var mask = MaskedCardNumber(this.state.cardNumber);
        const urlParams = new URLSearchParams(this.props.location.search);
        const orderTotal = urlParams.get('orderTotal');
        this.setState({ submitted:true});
        const basketObj = this.state.basket;
        console.log(orderTotal);
      //  const orderTotal = basketObj.orderTotal != null ? basketObj.orderTotal : '';
        axios.get(`http://localhost:8080/addpaymentinstrument/` +this.state.basketId, {
            params:{
                        cardType: this.state.cardType,
                        expirationMonth: this.state.expirationMonth,
                        expirationYear: this.state.expirationYear,
                        holder: this.state.cardHolder,
                        maskedNumber: mask,
                        orderTotal: orderTotal,
                        headers: this.state.headers
            } 
        })
        .then(res => {
            const basket = res.data;
            this.setState({basket});
            this.setState({isLoaded: true})
            console.log(basket);
            window.location.href=`/order/`+basket.basketId;
        })
    }

    async fetchCartInfo(headers) {
		try {
			const res = await axios.get(`http://localhost:8080/baskets/` + this.props.match.params.id, { headers: headers });
			return res.data;
		} catch (error) {
			console.error("Error fetching cart info", error);
        	window.location.href = "http://localhost:3000/carterror";
		}
	}

	async componentDidMount() {
		const bearerToken = Cookies.get('bearerToken');
		const inThirtyMinutes = 1/48;

		if(!bearerToken) {
			axios.get(`http://localhost:8080/shopper/auth/guest`)
			.then(res => {
				const bearerToken = res.data;
				Cookies.set('bearerToken', bearerToken, {
					expires: inThirtyMinutes
				});
				this.setState({ bearerToken });
				const headers = {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + bearerToken
				}
				this.setState({ headers });
				this.fetchCartInfo(headers);
			})
			.catch(error => {
				console.error("Error fetching guest auth token:", error);
				window.location.href = "http://localhost:3000/errorpage";
			});
		} else {
			try {
				const headers = {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + bearerToken
				};
				this.setState({ headers });
				const basket = await this.fetchCartInfo(headers);
				if (basket) {
					this.setState({ basket, productItemsArr: basket.productItems });
				}
			} catch (error) {
				console.error("Error fetching basket info", error);
				window.location.href = "http://localhost:3000/carterror";
			}
		}
	}
    
  render() {
      if(this.state.submitted===false){
        return (
            <div>
              <Helmet>
                  <title>Payment page</title>
                  <meta name="theme-color" content="#ccc" />
              </Helmet>
              <Navbar></Navbar>
              <div className="contashipping-heading container mb-5">
                <div class="row mt-3 mb-5 p-3 my-3 alert alert-success">
                    <div class="col col-lg-9 col-sm-8">
                        <h5><span class="fa fa-shopping-cart"></span> Shipping / Billing Info</h5>
                    </div>
                    <div class="col col-lg-3 col-sm-4">
                        <a href="/" class="btn btn-warning btn-sm btn-block" role="button"><span class="glyphicon glyphicon-share-alt"></span> Continue shopping</a>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-8 col-sm-12">
                        <form onSubmit={this.handleSubmission}>
                            <fieldset>
                            <div class="form-group">
                                <label class="col-sm-3 control-label" for="card-type">Card Type</label>
                                <div class="col-sm-9">
                                <select class="form-control col-sm-12" name="card-type" id="card-type"  onChange={this.handleCardType}>
                                    <option>Card Type</option>
                                    <option value="Amex">American Express</option>
                                    <option value="Diners">Diners Club</option>
                                    <option value="Mastercard">Mastercard</option>
                                    <option value="Visa">Visa</option>
                                </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label" for="card-holder-name">Name on Card</label>
                                <div class="col-sm-9">
                                <input type="text" class="form-control" name="card-holder-name" id="card-holder-name" placeholder="Card Holder's Name" value={this.state.cardHolder} onChange={this.handleCardHolder}/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label" for="card-number">Card Number</label>
                                <div class="col-sm-9">
                                <input type="text" class="form-control" name="card-number" id="card-number" placeholder="Debit/Credit Card Number" value={this.state.cardNumber} onChange={this.handleCardNumber}/>
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="col-sm-3 control-label" for="expiry-month">Expiration Date</label>
                                <div class="col-sm-9">
                                    <div class="row">
                                        <div class="col-6">
                                        <select class="form-control col-sm-12" name="expiry-month" id="expiry-month" onChange={this.handleExpirationMonth}>
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
                                        <div class="col-6">
                                        <select class="form-control" name="expiry-year" value={this.state.expirationYear} onChange={this.handleExpirationYear}>
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
                            <div class="form-group">
                                <label class="col-sm-3 control-label" for="cvv">Card CVV</label>
                                <div class="col-sm-3">
                                <input type="text" class="form-control" name="cvv" id="cvv" placeholder="Security Code"/>
                                </div>
                            </div>
                            <div class="form-group">
                                <div class="col-sm-offset-3 col-sm-9">
                                <button type="submit" class="btn btn-success">Pay Now</button>
                                </div>
                            </div>
                            </fieldset>
                        </form>
                        
                    </div>
                    <div class="col-lg-4 col-sm">
                        <div class="badge badge-warning">
                            <span class="fa fa-lg fa-exclamation-triangle"></span> IN-STORE PICKUP NOT AVAILABLE
                        </div>
                        <div class="border border-secondary p-2 rounded">
                            <p>We regret to inform you that instore pickup is not available in your area. Enter your address to get your order at your doorstep.</p> 
                        </div>
                        <hr/>
                        <div class="mb-2 p-1">
                            <span class="fa fa-lg fa-credit-card">ACCEPTED PAYMENT METHODS</span>
                        </div>
                        <div class="border border-secondary p-2 rounded">
                            <span class="fa fa-cc-amex fa-lg font-weight-lighter"></span> American Express<br/>
                            <span class="fa fa-cc-diners-club fa-lg font-weight-lighter"></span> Diners Club<br/>
                            <span class="fa fa-cc-mastercard fa-lg font-weight-lighter"></span> Master Card<br/>
                            <span class="fa fa-cc-visa fa-lg font-weight-lighter"></span> Visa<br/>
                        </div>
                    </div>
                </div>
              </div>                
          </div>
          )
        }
        else{
            const basketObj = this.state.basket;
            const productObj = (this.state.isLoaded && basketObj.productItems[0]);
            return(
                <div>
                    <Helmet>
                        <title>Payment Page</title>
                        <meta name="theme-color" content="#ccc" />
                    </Helmet>
                    <Navbar></Navbar>
                    <div className="contashipping-heading container card bg-white">
                        <div class="row">
                            <div class="col-1">
                                <Spinner animation="border" size="lg" />
                            </div> 
                            <div class="col-11">
                                <h3>Placing Your Order</h3>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
  }
}
export default Paymentpage