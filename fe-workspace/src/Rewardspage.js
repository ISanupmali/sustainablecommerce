import logo from './logo.svg';
import React, { useState } from 'react'
import axios from 'axios';
import { Wheel } from 'react-custom-roulette';
import Cookies from 'js-cookie';
import Navbar from './components/navbar';
import './App.css';

const data = [
  { option: '10', style: { backgroundColor: 'green', textColor: 'black' } },
  { option: '20', style: { backgroundColor: 'white' } },
  { option: '30' },
]

function App() {

  
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      const temp = (newPrizeNumber+1)*10;
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);

      setTimeout(() => {
        alert('Action completed!' + temp);
      }, 13000);
    }
  }

    return (
    <div>
      <Navbar></Navbar>
      <section class="1">
      <div class="container containerRewards px-4 px-lg-5 my-5">
        <div class="row gx-4 gx-lg-5 align-items-center">
          <div class="col-md-12">
          <>
          <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data}

              onStopSpinning={() => {
                setMustSpin(false);
              }}
            />
            <button onClick={handleSpinClick}>SPIN</button>
          </>
          <div class="info-card">You've won a coupon of <span class="discountcoupon">20</span>percent for your next order.</div>
          </div>
        </div>
      </div>
      </section>
    </div>
    );
}

export default App;
