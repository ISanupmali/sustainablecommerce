import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useHistory } from 'react-router-dom';

const QRScanner = () => {
  const [result, setResult] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [error, setError] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const qrCodeRef = useRef(null);
  const [accessToken, setAccessToken] = useState(null);
  const [couponGenerated, setCouponGenerated] = useState(false);
  const history = useHistory();
  let html5QrCode = useRef(null);

  const cookieName = 'accessToken';
  const inThirtyMinutes = 1 / 48; // Cookie expiration time

  const getAdminAuthToken = useCallback(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/get-accesstoken`)
      .then(res => {
        if (res.status === 200 && res.data) {
          setAccessToken(res.data); // Assuming accessToken is returned in res.data.accessToken
          Cookies.set(cookieName, res.data, {
            expires: inThirtyMinutes,
          });
        } else {
          console.log('Error occurred while fetching Admin access token: ', res);
          setError(true); // Set error state for UI feedback
        }
      })
      .catch(error => {
        console.log('Error while fetching Admin access token: ', error);
        setError(true); // Set error state for UI feedback
        window.location.href = `${process.env.REACT_APP_STOREFRONT_URL}/errorpage`;
      })
      .finally(() => {
        setTokenLoading(false); // Mark token loading as complete, even if it fails
      });
  }, [cookieName, inThirtyMinutes]);

  const fetchCoupon = async (qrCode) => {
    try {
      if (!accessToken) {
        getAdminAuthToken();
      }

      console.log(accessToken);
      const discount = qrCode;
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/updateCouponCodes`, { accessToken, discount });
      if (res.status === 200 && res.data.couponCode) {
        setCouponCode(res.data.couponCode);
        setError(false); // Clear error state if coupon code fetched successfully
        setCouponGenerated(true); // Set coupon generated flag
      } else {
        setError(true); // Set error state for UI feedback
      }
    } catch (error) {
      console.error('Error while generating Coupon from QR:', error);
      setError(true); // Set error state for UI feedback
    }
  };

  useEffect(() => {
    if (tokenLoading) {
      getAdminAuthToken();
    }
  }, [tokenLoading, getAdminAuthToken]);

  useEffect(() => {
    if (!couponGenerated) {
      html5QrCode.current = new Html5Qrcode("reader");

      const config = { fps: 10, qrbox: 250 };

      html5QrCode.current.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          setResult(decodedText);
          fetchCoupon(decodedText);
        },
        (errorMessage) => {
          console.error(errorMessage);
          setError(true); // Set error state for UI feedback
        }
      ).catch((err) => {
        console.error("Unable to start scanning.", err);
        setError(true); // Set error state for UI feedback
      });
    } else {
      // Stop the QR scanner when coupon is generated
      if (html5QrCode.current) {
        try {
          html5QrCode.current.stop().then(() => {
            console.log("QR Scanner stopped successfully.");
          }).catch((err) => {
            console.error("Error stopping QR scanner:", err);
          });
        } catch (err) {
          console.error("Error stopping QR scanner:", err);
        }
      }
    }

    return () => {
      // Cleanup: Stop the QR scanner when component unmounts
      if (html5QrCode.current) {
        try {
          html5QrCode.current.stop().then(() => {
            console.log("QR Scanner stopped successfully.");
          }).catch((err) => {
            console.error("Error stopping QR scanner:", err);
          });
        } catch (err) {
          console.error("Error stopping QR scanner:", err);
        }
      }
    };
  }, [couponGenerated, fetchCoupon]);

  // Function to handle back button click
  const handleBack = () => {
    history.goBack(); // Go back to the previous page
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <div id="reader" style={{ width: '300px', height: '300px' }} ref={qrCodeRef}></div>
      {couponCode ? (
              <div className="container">
                <button style={styles.backButton} onClick={handleBack}>Go Back</button>
                <div>An email has been sent to your email address. You can also take a snapshot of the code below for your reference.</div>
                <div className="alert alert-success" role="alert">
                  <strong>Coupon Code: </strong>{couponCode}
                </div>
              </div>
            ) : error ? (
              <div className="container">
                <button style={styles.backButton} onClick={handleBack}>Go Back</button>
                <div className="alert alert-danger" role="alert">
                  No Coupon Found
                </div>
              </div>
            ) : null}
    </div>
  );
};

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

export default QRScanner;
