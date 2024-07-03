import axios from 'axios';
import Cookies from "js-cookie";
import React, { Component } from 'react';
import { Wheel } from 'react-custom-roulette';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

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
      loading: false,     // Flag to indicate ongoing API requests
      wait: false         // Flag to indicate coupon code generation in progress
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
  getAdminAuthToken = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-accesstoken`)
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
        window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
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
    this.setState({ wait: true }); // Set wait state for coupon code generation
    this.setState({
      mustSpin: false,  // Stop spinning animation
      finalPrize: data[prizeNumber].option  // Set final prize text
    });
    const discount = data[prizeNumber].value;  // Get discount value from selected prize
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/updateCouponCodes`, {
        accessToken,
        discount  // Send access token and discount value to backend
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
      this.setState({ wait: false });   // Reset wait state after coupon code generation completes
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
    const { mustSpin, finalPrize, couponCode, error, loading, wait } = this.state;
    return (
      <Card style={styles.card}>
        <Card.Body style={styles.cardBody}>
          {/* Wheel component for spinning animation */}
          <div style={styles.wheelContainer}>
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={this.state.prizeNumber}
              data={data}
              onStopSpinning={this.handleStopSpinning}
              outerBorderColor={'#d3d3d3'}
              innerBorderColor={'#d3d3d3'}
              radiusLineColor={'#d3d3d3'}
              textFontSize={14}
              textDistance={50}
              diameter={400} // Adjust diameter to fit larger size
            />
          </div>

          {/* Render spin button if not spinning */}
          {!mustSpin && !finalPrize && (
            <Button variant="primary" style={styles.button} onClick={this.handleSpinClick}>SPIN</Button>
          )}

          {/* Render processing button during API requests */}
          {loading ? (
            <div style={styles.processingContainer}>
              <Button variant="secondary" style={styles.processingButton} disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {wait ? (
                  <span style={styles.processingText}>Generating coupon code</span>
                ) : (
                  <span style={styles.processingText}>Processing...</span>
                )}
              </Button>
            </div>
          ) : (
            <div style={styles.resultContainer}>
              {/* Render final prize and coupon code if available */}
              {finalPrize && couponCode ? (
                <div>
                  <Button variant="secondary" onClick={this.handleBackClick}>Go Back</Button>
                  <div style={styles.resultText}>
                    <strong>Congratulations! You have won {finalPrize} off for your next order</strong>
                    <br />
                    An email has been sent to your email address. You can also take a snapshot of the code below for your reference.
                    <br />
                    <Alert variant="success">
                      <strong>Coupon Code: </strong>{couponCode}
                    </Alert>
                  </div>
                </div>
              ) : error ? (
                <div>
                  <Button variant="secondary" onClick={this.handleBackClick}>Go Back</Button>
                  <Alert variant="danger" style={styles.errorAlert}>No Coupon Found</Alert>
                </div>
              ) : null}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  }
}

// Styles for the SpinWheel component
const styles = {
  card: {
    width: '520px',
    margin: 'auto',
    marginTop: '20px',
    padding: '20px',
    overflow: 'hidden',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)' // Box shadow for highlighting
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  wheelContainer: {
    width: '100%',
    overflow: 'hidden',
    textAlign: 'center'
  },
  button: {
    marginTop: '20px'
  },
  processingContainer: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  processingButton: {
    display: 'flex',
    alignItems: 'center'
  },
  processingText: {
    marginLeft: '5px'
  },
  resultContainer: {
    marginTop: '20px',
    fontSize: '18px',
    textAlign: 'center',
    width: '100%'
  },
  resultText: {
    marginTop: '10px'
  },
  errorAlert: {
    marginTop: '10px'
  }
};

export default SpinWheel;
