import React, { Component } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import Cookies from 'js-cookie';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from "react-router-dom";

const inThirtyMinutes = 1 / 48; // Cookie expiration time (30 minutes)
const cookieName = 'accessToken'; // Cookie name for storing access token

class QRScanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,  // Admin access token retrieved from backend
      couponCode: null,   // Generated coupon code
      error: false,       // Flag to indicate API errors
      loading: false,     // Flag to indicate ongoing API requests
      isScannerActive: false  // Flag to track if the scanner is active
    };
    this.html5QrCode = null;
  }

  componentDidMount() {
    this.getAdminAuthToken();
    this.startQRScanner();
  }

  componentWillUnmount() {
    this.stopQRScanner();
  }

  getAdminAuthToken = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-accesstoken`)
      .then(res => {
        if (res.status === 200) {
          this.setState({ accessToken: res.data });
          Cookies.set(cookieName, res.data, {
            expires: inThirtyMinutes,
          });
        } else {
          console.error('Error occurred while fetching Admin access token:', res);
        }
      })
      .catch(error => {
        console.error('Error while fetching Admin access token:', error);
        window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
      });
  }

  startQRScanner = () => {
    this.html5QrCode = new Html5Qrcode("reader");

    const config = { fps: 10, qrbox: 250 };

    this.html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        this.setState({ isScannerActive: true });
        this.handleQRScan(decodedText);
      },
      (errorMessage) => {
        console.error(errorMessage);
        this.setState({ error: true });
      }
    ).catch((err) => {
      console.error("Unable to start scanning.", err);
      this.setState({ error: true });
    });
  }

  stopQRScanner = () => {
    if (this.html5QrCode && this.state.isScannerActive) {
      this.html5QrCode.stop().catch((err) => {
        console.error('Error stopping QR scanner:', err);
      }).finally(() => {
        this.setState({ isScannerActive: false });
      });
    }
  }

  handleQRScan = async (qrCode) => {
    const { accessToken } = this.state;
    this.setState({ loading: true });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/updateCouponCodes`, {
        accessToken,
        discount: "20"  // Assuming QR code contains discount information
      });
      if (res.data.couponCode) {
        this.setState({ couponCode: res.data.couponCode });
      } else {
        this.setState({ error: true });
      }
    } catch (error) {
      console.error('Error while generating Coupon from QR:', error);
      this.setState({ error: true });
    } finally {
      this.setState({ loading: false });
      this.stopQRScanner(); // Ensure QR scanner stops after handling QR scan
    }
  };

  handleBackClick = () => {
    alert('Leaving this page!');
    this.props.history.push('/storeportal');
  };

  render() {
    const { couponCode, error, loading } = this.state;
    return (
      <Card style={styles.card}>
        <Card.Body style={styles.cardBody}>
          {!couponCode && (
            <div id="reader" style={styles.qrReader}></div>
          )}

          {loading ? (
            <div style={styles.processingContainer}>
              <Button variant="secondary" style={styles.processingButton} disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                <span style={styles.processingText}>Processing...</span>
              </Button>
            </div>
          ) : (
            <div style={styles.resultContainer}>
              {couponCode ? (
                <div>
                  <div style={styles.resultText}>
                    <strong>Congratulations! You have received a coupon code</strong>
                    <br />
                    An email has been sent to your email address. You can also take a snapshot of the code below for your reference.
                    <br />
                    <Alert variant="success">
                      <strong>Coupon Code: </strong>{couponCode}
                    </Alert>
                    <Link className="nav-link btn btn-link btn-warning" to="/storeportal">
                      Go Back
                  </Link>
                  </div>
                </div>
              ) : error ? (
                <div>
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

const styles = {
  card: {
    width: '520px',
    margin: 'auto',
    marginTop: '20px',
    padding: '20px',
    overflow: 'hidden',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)'
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  qrReader: {
    width: '100%',
    height: '400px',  // Increase height for larger QR reader area
    textAlign: 'center'
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

export default QRScanner;
