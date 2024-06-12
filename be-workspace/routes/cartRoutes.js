var express = require('express');
var router = express.Router();

/* CORS for Cross Site origin requests. */
const cors = require('cors');
router.use(cors());
router.options('*', cors());
const allowOriginUrl = '*';

// import Packages from "commerce-sdk" | Configurations to use while creating API Clients
const { Checkout, Product } = require("commerce-sdk");
// Create a configuration to use when creating API clients. Also fetch the authorization token in the config obect.
//var config = require('./configs/getauthorizationtoken.js');
var config1 = require('./configs/config');

// Get Basket Details using BasketID
function getBasketDetails (basketID, headerToken) {
    return new Promise(function(resolve, reject){
        try {
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperBaskets API client
            const shopperBasketsClient = new Checkout.ShopperBaskets(config1);
            const basketResult = shopperBasketsClient.getBasket({
                parameters: {
                    basketId: basketID                }
            });
            resolve(basketResult);
        } catch(e) {
            reject(e);
        }
    });
}

// Create New Basket and Add a Product
function createBasketObject(productID, quantity, headerToken) {
    return new Promise(function(resolve, reject){
        try {    
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperBaskets API client
            const shopperBasketsClient = new Checkout.ShopperBaskets(config1);
           // shopperBasketsClient.
            const basketResult = shopperBasketsClient.createBasket({
                body: { 
                    "productItems": [
                      {
                        "productId": productID,
                        "quantity": parseFloat(quantity),
                        "inventoryId": "inventory_m"
                      }
                    ]
                  },           
                });
            resolve(basketResult);
        } catch(e) {
            reject(e);
        }
    });
}


// Adds an Items to Existing basket 
function addItemToBasket(basketId, productId, quantity, headerToken) {
    return new Promise(function(resolve, reject){
        try {    
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperBaskets API client
            const shopperBasketsClient = new Checkout.ShopperBaskets(config1);
            const basketResult = shopperBasketsClient.addItemToBasket({
            parameters: {
                basketId: basketId
            },
            body: [
                {
                    "productId": productId,
                    "quantity": parseFloat(quantity)
                }
            ]
        });
            resolve(basketResult);
        } catch(e) {
            reject(e);
        }
    });
}

// updates an existing item in the basket 
function updateItemToBasket(basketId, itemId, quantity, headerToken){
    return new Promise(function(resolve, reject){
        try {
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperBaskets API client
            const shopperBasketsClient = new Checkout.ShopperBaskets(config);
            const basketResult = shopperBasketsClient.updateItemInBasket({
            parameters: {
                basketId: basketId,
                itemId: itemId
            },
            body: {
                "quantity": parseFloat(quantity)
            }
        });
            resolve(basketResult);
        } catch(e) {
            reject(e);
        }
    });
}

// Define the cart page route / endpoint
router.get('/baskets/:pid/:quantity', function(req,res) {
    var productID = req.params.pid;
    var quantity = req.params.quantity;
    var headerToken = req.headers.authorization;

    createBasketObject(productID, quantity, headerToken).then(function(resultsObj) {
        if (resultsObj) {
            res.send (resultsObj);
        } else {
            console.log("No results for basket");
            res.send ('No results for your basket');
        }
    }).catch(function(err) {
        console.log(err);
    });
        
});

router.get('/baskets/:id', function(req, res) {
    var basketID = req.params.id;
    var headerToken = req.headers.authorization;
    
    getBasketDetails(basketID, headerToken).then(function(resultsObj) {
        if (resultsObj) {
            res.send (resultsObj);
        } else {
            console.log("No results for basket");
            res.send ('No results for your basket');
        }
    }).catch(function(err) {
        console.log(err);
        res.status(404).json({success: false, error: 'Encountered an Error'});
    });
});

// Add Item to Existing Basket
router.get('/addItem/:basketId/:pid/:quantity', function(req, res) {
    var basketId  = req.params.basketId;
    var productId = req.params.pid;
    var quantity  = req.params.quantity;
    var headerToken = req.headers.authorization;

    addItemToBasket(basketId, productId, quantity, headerToken).then(function(resultsObj) {
        if (resultsObj) {
            res.send (resultsObj);
        } else {
            console.log("No such Item has been found");
            res.send ('Item has been not added to basket');
        }
    }).catch(function(err) {
        console.log(err);
    });
});

router.get('/updateItem/:basketId/:itemId/:quantity', function(req, res) {
    var basketId  = req.params.basketId;
    var itemId = req.params.itemId;
    var quantity  = req.params.quantity;
    updateItemToBasket(basketId, itemId, quantity).then(function(resultsObj) {
        if (resultsObj) {
            res.send (resultsObj);
        } else {
            console.log("Item update has failed");
            res.send ('Item not get updated');
        }
    }).catch(function(err) {
        console.log(err);
    });
});

module.exports = router;