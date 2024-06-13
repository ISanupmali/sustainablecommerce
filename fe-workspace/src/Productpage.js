import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/navbar';
import { Helmet } from 'react-helmet';

class Productpage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			products: [],
			product: [],
			productThumbnails: [],
			productImages: [],
			headers: '',
    		inThirtyMinutes: new Date(new Date().getTime() + 30 * 60 * 1000)
		}
	}

	async fetchProductInfo(headers) {
		try {
			const res = await axios.get(`http://localhost:8080/product/`+this.props.match.params.id, { headers: headers });
			return res.data;
		} catch (error) {
			console.error("Error fetching cart info", error);
        	window.location.href = "http://localhost:3000/errorpage";
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
				const headers = {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + bearerToken
				}
				this.setState({ headers });
				const productInfo = await this.fetchProductInfo(headers);
				if (productInfo) {
					const product = productInfo;
					const productThumbnails = product.imageGroups[2].images;
					const productImages = product.imageGroups[0].images;
					this.setState({ product, productThumbnails, productImages});
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
				this.setState({ headers });
				const productInfo = await this.fetchProductInfo(headers);
				if (productInfo) {
					const product = productInfo;
					const productThumbnails = product.imageGroups[2].images;
					const productImages = product.imageGroups[0].images;
					this.setState({ product, productThumbnails, productImages});
				}
			} catch (error) {
				console.error("Error fetching product info", error);
				window.location.href = "http://localhost:3000/errorpage";
			}
		}
	}

	handleAddToBasket = (event) =>{
        var basketData = sessionStorage.getItem('basketData') ? JSON.parse(sessionStorage.getItem('basketData')):'';
		const variantId = this.state.product.variants[0].productId;
		const productImgUrl = this.state.productThumbnails[0].disBaseLink;
		if(basketData){
            var storedProductIndex	= basketData.products.findIndex((item) => item.productId == variantId);
			if(storedProductIndex > -1){
				const qty = basketData.products[storedProductIndex].qty +1;
				axios.get(`http://localhost:8080/updateItem/`+basketData['basketId']+`/`+basketData.products[storedProductIndex].itemId+`/`+qty, { headers: this.state.headers })
				.then(res => {
                var cartItemIndex	= res.data.productItems.findIndex((item) => item.productId == variantId);
				basketData.products[storedProductIndex].qty = res.data.productItems[cartItemIndex].quantity;
				basketData.products[storedProductIndex].itemId = res.data.productItems[cartItemIndex].itemId;
				basketData['basketCount']=res.data.productItems.length;
				sessionStorage.setItem('basketData', JSON.stringify(basketData));
				this.setState({basket: res.data});
			})
			}else{
				axios.get(`http://localhost:8080/addItem/`+basketData['basketId']+`/`+variantId+`/1`, { headers: this.state.headers })
				.then(res => {
					const cartItem	= res.data.productItems.find((item) => item.productId == variantId);
					basketData.products.push({
						productId: cartItem.productId,
						qty: cartItem.quantity,
						itemId: cartItem.itemId,
						imgUrl : productImgUrl
					});
					basketData['basketCount']=res.data.productItems.length;
					sessionStorage.setItem('basketData', JSON.stringify(basketData));
					this.setState({basket: res.data});
					console.log(basketData);
				})
			}
		} else{
			axios.get(`http://localhost:8080/baskets/`+variantId+`/1`, { headers: this.state.headers })
			.then(res => {
				const products = [];
				res.data.productItems.map((item) => {
                    products.push({
						productId: item.productId,
						qty: item.quantity,
						itemId: item.itemId,
						imgUrl : productImgUrl
					});
				});
				const basketObj = {"basketId": res.data.basketId,"basketCount" : res.data.productItems.length,"products" : products};
				sessionStorage.setItem('basketData', JSON.stringify(basketObj));
				this.setState({basket: res.data});
				console.log(basketObj);
			})
		}
	}

  render() {
	const productObj = this.state.product;
	const thumbnailsObj = this.state.productThumbnails;
	const productImagesObj = this.state.productImages;
	let countT = 0;
	let countI = 0;

    return (
      <div>
		<Helmet>
			<title>{productObj.name + ' ' + productObj.primaryCategoryId}</title>
			<meta name="description" content="{productObj.pageDescription}" />
			<meta name="theme-color" content="#ccc" />
		</Helmet>
        <Navbar></Navbar>

        <section class="py-5">
            <div class="container px-4 px-lg-5 my-5">
                <div class="row gx-4 gx-lg-5 align-items-center">
                    <div class="col-md-6">
                    <div id="myCarousel" class="carousel slide" data-ride="carousel">
					<ol class="carousel-indicators">
						{ productImagesObj.map((image, index) => {
								if(index == 0) {
									return <li data-target="#myCarousel" data-slide-to={index} class="active"></li>
								} else {	
									return <li data-target="#myCarousel" data-slide-to={index}></li>
								}
							}
						)}
					</ol>
					<div class="carousel-inner">
							{ productImagesObj.map(image => {
									countI = countI+1;
									if(countI == 1) {
										return <div class="item active"><img src={image.disBaseLink} /></div>
									} else {	
										return <div class="item"><img src={image.disBaseLink} /></div>
									}
								}
							)}
					</div>
					<a class="left carousel-control" href="#myCarousel" data-slide="prev">
						<span class="icon-prev"></span>
						<span class="sr-only">Previous</span>
					</a>
					<a class="right carousel-control" href="#myCarousel" data-slide="next">
						<span class="icon-next"></span>
						<span class="sr-only">Next</span>
					</a>
					</div>
				</div>
				<div class="col-md-6">
					<div class="small mb-1">SKU: {productObj.id}</div>
					<h1 class="display-5 fw-bolder">{productObj.name}</h1>
					<div class="fs-5 mb-5">
						<span>${productObj.price}</span>
					</div>
					<p class="lead">{this.state.product.longDescription}</p>
					<div class="d-flex">
						<input class="form-control text-center me-3" id="inputQuantity" type="num" value="1"/>
						<button class="btn btn-outline-dark flex-shrink-0" type="button" onClick={this.handleAddToBasket}>
							<i class="bi-cart-fill me-1"></i>
							Add to cart
						</button>
					</div>
				</div>
                </div>
            </div>
        </section>
	</div>
    )
  }
}

export default Productpage