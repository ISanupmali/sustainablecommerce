import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Navbar extends React.Component {
    render() {
        var basketData = sessionStorage.getItem('basketData') ? JSON.parse(sessionStorage.getItem('basketData')):'';
        return (
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container px-4 px-lg-5">
                    <a class="navbar-brand" href="http://localhost:3000">Demo Store</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                            <li class="nav-item"><a class="nav-link active" aria-current="page" href="http://localhost:3000">Home</a></li>
                            <li class="nav-item"><a class="nav-link" href="/category/mens">Mens</a></li>
                            <li class="nav-item"><a class="nav-link" href="/category/womens">Womens</a></li>
                            <li class="nav-item"><a class="nav-link" href="/category/electronics">Electronics</a></li>
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">Shop</a>
                                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li><a class="dropdown-item" href="#!">All Products</a></li>
                                    <li><hr class="dropdown-divider" /></li>
                                    <li><a class="dropdown-item" href="#!">Popular Items</a></li>
                                    <li><a class="dropdown-item" href="#!">New Arrivals</a></li>
                                </ul>
                            </li>
                        </ul>
                        <form class="d-flex">                            
                            <a class="btn btn-outline-dark" href={basketData ? '/baskets/'+basketData['basketId'] : '#'}>
                                <i class="bi-cart-fill me-1"></i>
                                Cart
                                <span class="badge bg-dark text-white ms-1 rounded-pill">{basketData['basketCount']}</span>
                            </a>
                        </form>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar;