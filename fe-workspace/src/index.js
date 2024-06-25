import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "jquery/dist/jquery.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";

// Component Imports
import App from "./App";
import Productpage from "./Productpage";
import Cartpage from "./Cartpage";
import Carterrorpage from "./Carterrorpage";
import Categorypage from "./Categorypage";
import Errorpage from "./Errorpage";
import Shipmentpage from "./Shipmentpage";
import Paymentpage from "./Paymentpage";
import OrderConfirmationPage from "./Orderconfirmationpage";
import RewardsPage from "./Rewardspage";

const routing = (
  <Router>
    <div>
      <Route path="/" exact component={App} />
      <Route path="/product/:id" component={Productpage} />
      <Route path="/baskets/:id" component={Cartpage} />
      <Route path="/carterror" component={Carterrorpage} />
      <Route path="/category/:id" component={Categorypage} />
      <Route path="/errorpage" component={Errorpage} />
      <Route path="/shipment/:id" component={Shipmentpage} />
      <Route path="/payment/:id" component={Paymentpage} />
      <Route path="/order/:id" component={OrderConfirmationPage} />
      <Route path="/orderrewards" component={RewardsPage} />
    </div>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(routing);
