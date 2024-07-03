import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Navbar from './components/navbar';
import Footer from './components/Footer';
import { Link } from 'react-router-dom';
import Loading from './components/Loading';
import Categorybanner from './components/Categorybanner';
import { InstantSearch, SearchBox, Hits, Configure } from 'react-instantsearch-dom';
import searchClient from './algoliaClient';
import './App.css';

const Hit = ({ hit }) => (
  <div className="col mb-5">
    <div className="card h-100">
      <Link className="btn btn-outline-dark mt-auto" to={`/product/${hit.productId}`}>
        <img className="card-img-top" src={hit.p_image || hit.image?.link} alt={hit.productName} />
      </Link>
      <div className="card-body p-4">
        <div className="text-center">
          <h5 className="fw-bolder">{hit.productName}</h5>
          ${hit.price}
        </div>
      </div>
      <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div className="text-center">
          <Link className="btn btn-outline-dark mt-auto" to={`/product/${hit.productId}`}>
            View options
          </Link>
        </div>
      </div>
    </div>
  </div>
);

class Categorypage extends React.Component {
  state = {
    isLoading: true,
    products: [],
    headers: null,
    searchActive: false
  };

  async fetchCategoryData(headers) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/category/${this.props.match.params.id}`,
        { headers: headers }
      );
      return res.data.hits;
    } catch (error) {
      console.error("Error fetching category info", error);
      window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
    }
  }

  async componentDidMount() {
    const bearerToken = Cookies.get('bearerToken');
    const inThirtyMinutes = 1 / 48;

    if (!bearerToken) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/shopper/auth/guest`)
        .then(async (res) => {
          const bearerToken = res.data;
          Cookies.set('bearerToken', bearerToken, {
            expires: inThirtyMinutes,
          });
          const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + bearerToken,
          };
          this.setState({ headers });
          const products = await this.fetchCategoryData(headers);
          if (products) {
            this.setState({ products, isLoading: false });
          }
        })
        .catch((error) => {
          console.error('Error fetching guest auth token:', error);
          window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
        });
    } else {
      try {
        const headers = {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + bearerToken,
        };
        this.setState({ headers });
        const products = await this.fetchCategoryData(headers);
        if (products) {
          this.setState({ products, isLoading: false });
        }
      } catch (error) {
        console.error('Error fetching product info', error);
        this.setState({ isLoading: false });
        window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
      }
    }
  }

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.setState({ isLoading: true });
      const products = await this.fetchCategoryData(this.state.headers);
      if (products) {
        this.setState({ products, isLoading: false });
      }
    }
  }

  handleSearchStateChange = ({ query }) => {
    this.setState({ searchActive: !!query });
  };

  render() {
    return (
      <div>
        <Navbar />
        <section className="py-2 bg-light" style={{ minHeight: '600px' }}>
          <div className="container px-4 px-lg-5 mt-5">
            <h2 className="fw-bolder mb-4 cattitle text-capitalize">
              {this.props.match.params.id.replace(/-/g, ' ')} Category
            </h2>
            <Categorybanner />
            {this.state.isLoading ? (
              <Loading />
            ) : (
              <>
                <p>Search powered by  <img class="iconimg" src="https://cdn.iconscout.com/icon/free/png-512/free-algolia-3521265-2944769.png" alt=""/> <span class="bluetext">Algolia </span> - Refine further by typing your search query below!</p>
                <InstantSearch
                  indexName="testcatalog"
                  searchClient={searchClient}
                  onSearchStateChange={this.handleSearchStateChange}
                >
                  <Configure hitsPerPage={20} />
                  <SearchBox className="custom-search-box" />
                  <hr/><br/>

                  <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
                    {!this.state.searchActive &&
                      this.state.products.map(product => (
                        <Hit key={product.objectID} hit={product} />
                      ))}
                    {this.state.searchActive && <Hits hitComponent={Hit} />}
                  </div>
                </InstantSearch>
              </>
            )}
          </div>
        </section>
        <Footer />
      </div>
    );
  }
}

export default Categorypage;
