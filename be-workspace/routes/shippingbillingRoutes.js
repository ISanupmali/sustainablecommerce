var express = require('express');
var router = express.Router();

const { Checkout, ClientConfig } = require("commerce-sdk");
// Create a configuration to use when creating API clients. Also fetch the authorization token in the config obect.
var config1 = require('./configs/config');

function addAddress (basketId, shippingaddress, billingaddress, useAsBilling, headerToken) {
    return new Promise(function(resolve, reject){
        try {
            config1.headers["authorization"] = headerToken;
            addShippingMethod(basketId, headerToken).then(function(initBasketResult) {
                if(initBasketResult){
                    addShippingAddress(basketId, shippingaddress, useAsBilling, headerToken).then(function(afterShippingBAsket){
                        if(afterShippingBAsket){
                            if(useAsBilling === 'true'){
                                resolve(afterShippingBAsket);
                            }
                            else{
                                // Create a new ShopperBaskets API client
                                const shopperBasketsClient = new Checkout.ShopperBaskets(config1);
                                // shopperBasketsClient.
                                const basketResult = shopperBasketsClient.updateBillingAddressForBasket({
                                    body: {
                                        "address1": billingaddress.address1,
                                        "city": billingaddress.city,
                                        "countryCode": billingaddress.countryCode,
                                        "firstName": billingaddress.firstName,
                                        "lastName": billingaddress.lastName,
                                        "postalCode": billingaddress.postalCode,
                                        "stateCode": billingaddress.stateCode
                                    },
                                    parameters: {
                                        basketId: basketId,
                                        shipmentId: "me",
                                        useAsBilling: useAsBilling
                                    }  
                                });
                                resolve(basketResult);
                            }
                        }
                        else{
                            res.send("error");
                        }
                    });
                }
                else{
                    res.send("error");
                }
            });
            
        } catch(e) {
            reject(e);
        }
    });
}

function addShippingAddress (basketId, shippingaddress, useAsBilling, headerToken) {
    return new Promise(function(resolve, reject){
        try {
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperBaskets API client
            const shopperBasketsClient = new Checkout.ShopperBaskets(config1);
            const basketResult = shopperBasketsClient.updateShippingAddressForShipment({
                body: {
                    "address1": shippingaddress.address1,
                    "city": shippingaddress.city,
                    "countryCode": shippingaddress.countryCode,
                    "firstName": shippingaddress.firstName,
                    "lastName": shippingaddress.lastName,
                    "postalCode": shippingaddress.postalCode,
                    "stateCode": shippingaddress.stateCode
                },
                parameters: {
                    basketId: basketId,
                    shipmentId: "me",
                    useAsBilling: useAsBilling
                }  
            });
            resolve(basketResult);
        } catch(e) {
            reject(e);
        }
    });
}

function addShippingMethod (basketId, headerToken) {
    return new Promise(function(resolve, reject){
        try {
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperBaskets API client
            const shopperBasketsClient = new Checkout.ShopperBaskets(config1);
            const basketResult = shopperBasketsClient.updateShippingMethodForShipment({
                body: {
                    "id": "003"
                  },
                  parameters: {
                      basketId: basketId,
                      shipmentId: "me"
                  }  
                });
            resolve(basketResult);
        } catch(e) {
            reject(e);
        }
    });
}

// Route to Add Shiping Address, Billing Address & Shipment to Basket
router.get('/shipment/add/:basketId', function(req, res) {
    var basketId = req.params.basketId;
    var sa = JSON.stringify(req.query.shipping);
    var shippingaddress = JSON.parse(sa);
    var useAsBilling = req.query.useAsBilling;
    var headerToken = req.headers.authorization;

    if(useAsBilling === 'true') {
        var billingaddress = shippingaddress;
    } else {
        var ba = JSON.stringify(req.query.billing);
        var billingaddress = JSON.parse(ba);
    }
    
    addAddress(basketId, shippingaddress, billingaddress, useAsBilling, headerToken).then(function(resultsObj) {
        if (resultsObj) {
            res.send (resultsObj);
        } else {
            console.log("Shipping Address could not be added");
            res.send ('Shipping Address could not be added');
        }
    }).catch(function(err) {
        console.log(err);
    });
});

module.exports = router;