import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/navbar';
import { Helmet } from 'react-helmet';

class Cartpage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			basket: [],
			productItemsArr: []
		}
	}

	getProductImage = (productId, basketData) => {
		const item	= basketData.products.find((item) => item.productId == productId);
		return item.imgUrl;
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
			.then(async res => {
				const bearerToken = res.data;
				Cookies.set('bearerToken', bearerToken, {
					expires: inThirtyMinutes
				});
				this.setState({ bearerToken });
				try {
					const headers = {
						'Content-Type': 'application/json',
						'Authorization': 'Bearer ' + bearerToken
					};
					const basket = await this.fetchCartInfo(headers);
					if (basket) {
						this.setState({ basket, productItemsArr: basket.productItems });
					}
				} catch (error) {
					console.error("Error fetching basket info", error);
					window.location.href = "http://localhost:3000/carterror";
				}
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
	const basketObj = this.state.basket;
	const productLineItems = this.state.productItemsArr;
	var basketData = sessionStorage.getItem('basketData') ? JSON.parse(sessionStorage.getItem('basketData')):'';
	
    return (
      <div>
		<Helmet>
			<title>Your Cart</title>
			<meta name="theme-color" content="#ccc" />
		</Helmet>
		<Navbar></Navbar>
			<div className="container">
				<div class="row mt-5 mb-2 p-3 my-3 alert alert-success">
					<div class="col col-lg-9 col-sm-8">
						<h5><span class="fa fa-shopping-cart"></span> Your Cart</h5>
					</div>
					<div class="col col-lg-3 col-sm-4">
						<a href="/" class="btn btn-warning btn-sm btn-block" role="button"><span class="glyphicon glyphicon-share-alt"></span> Continue shopping</a>
					</div>
				</div>
				
				<div class="row">
					<div class="col-lg-8 col-sm-12">
						{ productLineItems.map(PLI =>
							<div class="row mt-5">
								<div class="col col-lg-8">
									<div class="col-12"><img class="img-responsive cartimg" src={this.getProductImage(PLI.productId,basketData)}/>
										<p class="product-name"><strong>{PLI.productName}</strong>
										<br/>
										<small>{PLI.productId}</small></p>
									</div>
								</div>
								<div class="col-4">
									<div class="row">
										<div class="col-6">
											<strong>${parseFloat(PLI.price).toFixed(2)} <span class="text-muted">x</span></strong>
										</div>
										<div class="col-6">
											<input type="text" class="form-control input-sm" value="1"/>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					<div class="col-lg-4 col-sm-12">
						<div class="row mb-4">
							<div class="col-lg-12 col-sm-12">
								<div class="alert alert-info">
									<p class="text-uppercase mb-2">The Following payment methods are accepted</p><br/>
									<span class="fa fa-cc-amex fa-lg font-weight-lighter"></span> American Express<br/>
									<span class="fa fa-cc-diners-club fa-lg font-weight-lighter"></span> Diners Club<br/>
									<span class="fa fa-cc-mastercard fa-lg font-weight-lighter"></span> Master Card<br/>
									<span class="fa fa-cc-visa fa-lg font-weight-lighter"></span> Visa<br/>
								</div>
							</div>
							<div class="col-lg-12 col-sm-12">
								<div class="alert alert-info">
									<p class="text-right font-weight-lighter">
										Product Sub Total: <strong>${parseFloat(basketObj.productSubTotal).toFixed(2)}</strong><br/>
										Adjusted Total Tax: <strong>${basketObj.adjustedMerchandizeTotalTax}</strong><br/>
										Total: <strong>${parseFloat(basketObj.productTotal).toFixed(2)}</strong><br/>
									</p>
									<div class="form-check mb-1 small">
										<input class="form-check-input" type="checkbox" value="" id="tnc"/>
										<label class="form-check-label" for="tnc">
											I agree to the <a href="#">terms and conditions</a>
										</label>
									</div>
									<div class="form-check mb-3 small">
										<input class="form-check-input" type="checkbox" value="" id="subscribe"/>
										<label class="form-check-label" for="subscribe">
											Get emails about product updates and events. If you change your mind, you can unsubscribe at any time. <a href="#">Privacy Policy</a>
										</label>
									</div>
									<a class="btn btn-primary w-100 mt-2" href={'/shipment/' + this.props.match.params.id}>Continue to Checkout</a>
								</div>
							</div>
						</div>
					</div>
				</div>

			</div>
	  </div>
    )
  }
}
export default Cartpage