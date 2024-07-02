import React, { useState } from "react";
import "../App.css";

const Carttotal = (props) => {
  const basket = props.basket;

  return (
    <>
      <div className="row">
        <div className="col-7 text-left">Product Sub Total:</div>
        <div className="col-5 text-end font-weight-lighter">
          <strong>${parseFloat(basket.productSubTotal).toFixed(2)}</strong>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-7 text-left">Adjusted Total Tax:</div>
        <div className="col-5 text-end font-weight-lighter">
          <strong>${basket.adjustedMerchandizeTotalTax}</strong>
        </div>
      </div>

      <div className="row mt-2">
        <div className="col-7 text-left">Total:</div>
        <div className="col-5 text-end font-weight-lighter">
          <strong>${parseFloat(basket.productTotal).toFixed(2)}</strong>
        </div>
      </div>
    </>
  );
};

export default Carttotal;
