import logo from './logo.svg';
import React, { Component } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/navbar';
import './App.css';

class App extends React.Component {

  state = {
		products: [],
    bearerToken: '',
    headers: '',
    inThirtyMinutes: new Date(new Date().getTime() + 30 * 60 * 1000)
	}

  fetchCategoryData(headers) {
    axios.get(`http://localhost:8080/category/dresses`, { headers: headers })
      .then(res => {
      const products = res.data.hits;
      this.setState({ products });
    })
  }
	
	componentDidMount() {
    const bearerToken = Cookies.get('bearerToken');

    if(!bearerToken) {
      axios.get(`http://localhost:8080/shopper/auth/guest`)
      .then(res => {
        const bearerToken = res.data;
        Cookies.set('bearerToken', bearerToken, {
            expires: this.inThirtyMinutes
        });
        this.setState({ bearerToken });
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + bearerToken
        }
        this.fetchCategoryData(headers);
      })
    } else {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearerToken
      }
      this.fetchCategoryData(headers);
    }
	}

  render() {
    return (
    <div>
      <Navbar></Navbar>
      <section class="1">
      <div class="container px-4 px-lg-5 my-5">
        <div class="row gx-4 gx-lg-5 align-items-center">
          <div class="col-md-12">
            <h2 class="fw-bolder mb-4">You are Probably lost</h2>
            <span class="border"><img class="card-img-top mb-5 mb-md-0 border-0 " src="https://cdn.pixabay.com/photo/2016/10/25/23/54/not-found-1770320_1280.jpg" alt="..." /></span>
          </div>
        </div>
      </div>
      </section>

      <section class="py-5 bg-light">
            <div class="container px-4 px-lg-5 mt-5">
                <h2 class="fw-bolder mb-4">Top Recommendations</h2>
                <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                { this.state.products.map(product =>
                    <div class="col mb-5">
                        <div class="card h-100">
                            <img class="card-img-top" src={product.image.link} alt="..." />
                            <div class="card-body p-4">
                                <div class="text-center">
                                    <h5 class="fw-bolder">{product.productName}</h5>
                                    ${product.price}
                                </div>
                            </div>
                            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                                <div class="text-center"><a class="btn btn-outline-dark mt-auto" href={'/product/' + product.productId}>View options</a></div>
                            </div>
                        </div>
                    </div>
                )}
                </div>
            </div>
        </section>
    </div>
    );
  }
}

export default App;
