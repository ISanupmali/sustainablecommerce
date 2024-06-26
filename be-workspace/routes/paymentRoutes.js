var express = require('express');
var router = express.Router();

// import Packages from "commerce-sdk" | Configurations to use while creating API Clients
const {Checkout,Product} = require("commerce-sdk");
// Create a configuration to use when creating API clients. Also fetch the authorization token in the config obect.
var config1 = require('./configs/config');

//The below function adds a given payment Instrument in the basket and returns the updated basket
function addPaymentInstrument (basketID, paymentParams, headerToken) {
    return new Promise(function(resolve, reject){
        try {
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperBaskets API client
            const shopperBasketsClient = new Checkout.ShopperBaskets(config1);
            const basketResult = shopperBasketsClient.addPaymentInstrumentToBasket({
                parameters: {
                    basketId: basketID
                },
                body: {
                    "amount":  parseFloat(paymentParams.orderTotal),
                    "paymentCard": {
                        "cardType": paymentParams.cardType,
                        "expirationMonth": parseInt(paymentParams.expirationMonth),
                        "expirationYear": parseInt(paymentParams.expirationYear),
                        "holder": paymentParams.holder,
                        "maskedNumber": paymentParams.maskedNumber
                    },
                    "paymentMethodId": "CREDIT_CARD"
                }
            });
            resolve(basketResult);
        } catch(e) {
            reject(e);
        }
    });
}

//The below endpoint adds a given payment Instrument in the basket
router.get('/addpaymentinstrument/:basketId', function(req, res) {
    var basketID = req.params.basketId;
    var paymentParams = req.query;
    var headerToken = req.headers.authorization;
   // var orderTotal = req.params.orderAmount;
    addPaymentInstrument(basketID, paymentParams, headerToken).then(function(resultsObj) {
        if (resultsObj) {
            res.send (resultsObj);
        } else {
            console.log("No payment instrument has been added");
            res.send ('No payment instrument has been created for the given basket');
        }
    }).catch(function(err) {
        console.log(err);
    });
});
 
module.exports = router;
        