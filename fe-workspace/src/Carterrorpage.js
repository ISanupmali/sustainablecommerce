import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/navbar';
import { Helmet } from 'react-helmet';

class Carterrorpage extends React.Component {

	componentWillMount() {
		const bearerToken = Cookies.get('bearerToken');
		if(bearerToken) {
			Cookies.set('bearerToken', bearerToken, {
				expires: 0
			});
		}
		
		sessionStorage.removeItem('basketData');
	}

  render() {
	var basketData = sessionStorage.getItem('basketData') ? JSON.parse(sessionStorage.getItem('basketData')):'';
	
	return (
			<div>
				<Helmet>
					<title>Your Cart</title>
					<meta name="theme-color" content="#ccc" />
				</Helmet>
				<Navbar navBarBasketData={basketData}></Navbar>
				<section class="1">
					<div class="container px-4 px-lg-5 my-5">
						<div class="jumbotron">
							<h1 class="display-4">Your Session Has Expired</h1>
							<p class="lead">Please navigate to the Home Page and start adding new items to your basket.</p>
							<hr class="my-4"/>
							<p>This may have occurred due to inactivity for a long time or a basket error.</p>
							<p class="lead">
								<a class="btn btn-primary btn-lg" href="/" role="button">Navigate to Homepage</a>
							</p>
						</div>
					</div>
				</section>
			</div>
		)
  }
}
export default Carterrorpage