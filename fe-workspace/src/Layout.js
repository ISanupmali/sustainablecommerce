import logo from './logo.svg';
import React, { Component } from 'react';
import axios from 'axios';
import Navbar from './components/navbar';
import './App.css';

class Layout extends React.Component {

  state = {
		products: []
	}
	
	componentDidMount() {
	axios.get(`http://localhost:8080/category/shoes`)
	  .then(res => {
		const products = res.data.hits;
		this.setState({ products });
		console.log(products);
	  })
	}

  render() {
    return (
    <div>
      <Navbar></Navbar>
      <section class="1">
      <div class="container px-4 px-lg-5 my-5">
        <div class="row gx-4 gx-lg-5 align-items-center">
          <div class="col-md-12">
            <span class="border"><img class="card-img-top mb-5 mb-md-0 border-0 " src="https://cdn.pixabay.com/photo/2024/03/26/11/57/woman-8656653_960_720.jpg" alt="..." /></span>
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

export default Layout;
