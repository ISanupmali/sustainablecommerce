var express = require('express');
var router = express.Router();

// import Packages from "commerce-sdk" | Configurations to use while creating API Clients
const {Checkout,Product} = require("commerce-sdk");
// Create a configuration to use when creating API clients. Also fetch the authorization token in the config obect.
var config1 = require('./configs/config');

//The below function coverts the basket into order and returns the order object
function createOrderFromBasket (basketID, headerToken) {
    return new Promise(function(resolve, reject){
        
        try {
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperOrders API client
            const shopperOrdersClient = new Checkout.ShopperOrders(config1);
            const orderResult = shopperOrdersClient. createOrder({
                body: {
                    "basketId": basketID
                }
            });
            resolve(orderResult);
        } catch(e) {
            reject(e);
        }
    });
}

 // The below route is for creating the order from basket with the basket Id
router.get('/createorder/:basketId', function(req, res) {
    var basketID = req.params.basketId;
    var headerToken = req.headers.authorization;

    createOrderFromBasket(basketID, headerToken).then(function(resultsObj) {
        if (resultsObj) {
            res.send (resultsObj);
        } else {
            console.log("No results for Order");
            res.send ('Your order has not been placed');
        }
    }).catch(function(err) {
        console.log(err);
    });
});

module.exports = router;
        