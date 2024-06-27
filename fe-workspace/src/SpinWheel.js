import React, { Component } from 'react';
import axios from 'axios';
import { Wheel } from 'react-custom-roulette';

const data = [
  { option: '5% Off', style: { backgroundColor: '#FF5733', textColor: '#FFFFFF' }, value: 5 },
  { option: '10% Off', style: { backgroundColor: '#33FF57', textColor: '#FFFFFF' }, value: 10 },
  { option: '15% Off', style: { backgroundColor: '#3357FF', textColor: '#FFFFFF' }, value: 15 },
  { option: '20% Off', style: { backgroundColor: '#F1C40F', textColor: '#FFFFFF' }, value: 20 },
  { option: '25% Off', style: { backgroundColor: '#9B59B6', textColor: '#FFFFFF' }, value: 25 },
];

class SpinWheel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mustSpin: false,
      prizeNumber: 0,
      finalPrize: null,
      accessToken: null,
      couponCode: null,
      error: false,
      loading: false
    };
  }

  componentDidMount() {
    axios.get('http://localhost:8080/get-accesstoken')
      .then(res => {
        if (res.status === 200) {
          this.setState({ accessToken: res.data });
        } else {
          console.error('Error fetching Admin access token:', res);
        }
      })
      .catch(error => {
        console.error('Error while fetching Admin access token:', error);
        window.location.href = 'http://localhost:3000/errorpage';
      });
  }

  handleSpinClick = () => {
    this.setState({ loading: true });
    const newPrizeNumber = Math.floor(Math.random() * data.length);
    this.setState({
      mustSpin: true,
      prizeNumber: newPrizeNumber
    });
  };

  handleStopSpinning = async () => {
    const { prizeNumber, accessToken } = this.state;
    this.setState({
      mustSpin: false,
      finalPrize: data[prizeNumber].option
    });
    const discount = data[prizeNumber].value;
    try {
      const res = await axios.post('http://localhost:8080/updateCouponCodes', {
        accessToken, discount
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
      this.setState({ loading: false });
    }
  };

  handleBackClick = () => {
    alert('Leaving this page!');
    this.props.history.push('/storeportal');
  };

  render() {
    const { mustSpin, finalPrize, couponCode, error, loading } = this.state;
    return (
      <div style={styles.container}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={this.state.prizeNumber}
          data={data}
          onStopSpinning={this.handleStopSpinning}
        />

        {!mustSpin && !finalPrize && (
          <button style={styles.button} onClick={this.handleSpinClick}>SPIN</button>
        )}

        {loading ? (
          <button className="btn btn-primary" type="button" disabled>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Loading...
          </button>
        ) : (
          <div style={{ marginTop: '20px', fontSize: '18px' }}>
            {finalPrize && couponCode ? (
              <div className="container">
                <button style={styles.backButton} onClick={this.handleBackClick}>Go Back</button>
                <div style={styles.result}>Final Prize: {finalPrize}</div>
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
