import axios from 'axios';
import Cookies from "js-cookie";
import React, { Component } from 'react';
import { Wheel } from 'react-custom-roulette';

// Data for the spinning wheel options
const data = [
  { option: '5% Off', style: { backgroundColor: '#FF5733', textColor: '#FFFFFF' }, value: 5 },
  { option: '10% Off', style: { backgroundColor: '#33FF57', textColor: '#FFFFFF' }, value: 10 },
  { option: '15% Off', style: { backgroundColor: '#3357FF', textColor: '#FFFFFF' }, value: 15 },
  { option: '20% Off', style: { backgroundColor: '#F1C40F', textColor: '#FFFFFF' }, value: 20 },
  { option: '25% Off', style: { backgroundColor: '#9B59B6', textColor: '#FFFFFF' }, value: 25 },
];

const inThirtyMinutes = 1 / 48; // Cookie expiration time (30 minutes)
const cookieName = 'accessToken'; // Cookie name for storing access token

/**
 * SpinWheel component manages the spinning wheel functionality.
 */
class SpinWheel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mustSpin: false,    // Flag to control wheel spinning animation
      prizeNumber: 0,     // Index of the selected prize option
      finalPrize: null,   // Final prize text to display
      accessToken: null,  // Admin access token retrieved from backend
      couponCode: null,   // Generated coupon code
      error: false,       // Flag to indicate API errors
      loading: false      // Flag to indicate ongoing API requests
    };
  }

  /**
   * Fetches admin access token from backend on component mount.
   */
  componentDidMount() {
    this.getAdminAuthToken();
  }

  /**
   * Fetches admin access token from backend.
   * Sets the access token in state and cookie.
   * Redirects to error page if fetching token fails.
   */
  getAdminAuthToken() {
    axios.get(`http://localhost:8080/get-accesstoken`)
        .then(res => {
            console.log('[FE]SpinWheel.js :: Admin Token Response: ' + JSON.stringify(res));
            if (res.status === 200) {
              // Set accessToken in component state and cookie
              this.setState({ accessToken: res.data });
                Cookies.set(cookieName, res.data, {
                    expires: inThirtyMinutes,
                  });
            } else {
                console.log('[FE]SpinWheel.js :: Error occurred While fetching Admin access token: ' + JSON.stringify(res));
            }
        })
        .catch(error => {
            console.log('[FE]SpinWheel.js :: Error While fetching Admin access token: ' + error);
            // Redirect to error page if fetching token fails
            window.location.href = "http://localhost:3000/errorpage";
        });
  }

  /**
   * Handles the click event for spinning the wheel.
   * Initiates spinning animation and sets loading state.
   * Fetches admin access token if not available in cookie.
   */
  handleSpinClick = () => {
    this.setState({ loading: true }); // Set loading state while spinning
    const newPrizeNumber = Math.floor(Math.random() * data.length); // Generate random prize index
    this.setState({
      mustSpin: true,   // Start spinning animation
      prizeNumber: newPrizeNumber  // Set new prize index
    });
    const token = Cookies.get(cookieName);
    if (!token) {
        this.getAdminAuthToken(); // Fetch token if not available in cookie
    }
  };

  /**
   * Handles the event when spinning animation stops.
   * Stops spinning animation, sets final prize, and fetches coupon code.
   * Sets error state if API request fails.
   * Resets loading state after API call completes.
   */
  handleStopSpinning = async () => {
    const { prizeNumber, accessToken } = this.state;
    this.setState({
      mustSpin: false,  // Stop spinning animation
      finalPrize: data[prizeNumber].option  // Set final prize text
    });
    const discount = data[prizeNumber].value;  // Get discount value from selected prize
    try {
      const res = await axios.post('http://localhost:8080/updateCouponCodes', {
        accessToken, discount  // Send access token and discount value to backend
      });
      if (res.data.couponCode) {
        this.setState({ couponCode: res.data.couponCode });
      } else {
        this.setState({ error: true });
      }
    } catch (error) {
      console.error('Error while generating Coupon:', error);
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false }); // Set loading state to false after API call completes
    }
  };

  /**
   * Handles the click event for navigating back to the store portal.
   * Alerts user before leaving the page and redirects accordingly.
   */
  handleBackClick = () => {
    alert('Leaving this page!');
    this.props.history.push('/storeportal');
  };

  /**
   * Renders the SpinWheel component with spinning wheel and result display.
   */
  render() {
    const { mustSpin, finalPrize, couponCode, error, loading } = this.state;
    return (
      <div style={styles.container}>
        {/* Wheel component for spinning animation */}
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={this.state.prizeNumber}
          data={data}
          onStopSpinning={this.handleStopSpinning}
        />

        {/* Render spin button if not spinning */}
        {!mustSpin && !finalPrize && (
          <button style={styles.button} onClick={this.handleSpinClick}>SPIN</button>
        )}

        {/* Render loading spinner during API requests */}
        {loading ? (
          <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button>
        ) : (
          <div style={{ marginTop: '20px', fontSize: '18px' }}>
            {/* Render final prize and coupon code if available */}
            {finalPrize && couponCode ? (
              <div className="container">
                <button style={styles.backButton} onClick={this.handleBackClick}>Go Back</button>
                <div style={styles.result}>Final Prize: {finalPrize}</div>
                <div>Coupon sent to the customer's email id.</div>
                <div className="alert alert-success" role="alert">
                  <strong>Coupon Code: </strong>{couponCode}
                </div>
              </div>
            ) : error ? (
              <div className="container">
                <button style={styles.backButton} onClick={this.handleBackClick}>Go Back</button>
                <div className="alert alert-danger" role="alert">
                  No Coupon Found
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

// Styles for different UI elements
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f0f0',
    padding: '20px'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  backButton: {
    marginTop: '20px',
    marginBottom: '5px',
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#6c757d',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  result: {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333'
  }
};

export default SpinWheel;
