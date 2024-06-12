var express = require('express');
var router = express.Router();

/* CORS for Cross Site origin requests. */
const cors = require('cors');
router.use(cors());
router.options('*', cors());
const allowOriginUrl = '*';

// import Packages from "commerce-sdk" | Configurations to use while creating API Clients
const { Search, Product } = require("commerce-sdk");
// Create a configuration to use when creating API clients. Also fetch the authorization token in the config obect.
//var config = require('./configs/getauthorizationtoken.js');
var config = require('./configs/config');

function getProductDetail(productID, headerToken){
    return new Promise(function(resolve, reject){
      
        try {    
            config.headers["authorization"] = headerToken;
            // Create a new ShopperProducts API client
            const shopperProductsClient = new Product.ShopperProducts(config);

            // Search for the specified product
            const productResult = shopperProductsClient.getProduct({
                parameters: {
                    id: productID                }
            });
            resolve(productResult);
        } catch(e) {
            reject(e);
        }
    });
}

// Define the product detail page route / endpoint
router.get('/product/:id', function(req, res) {
    var productID = req.params.id;
    var headerToken = req.headers.authorization;

    try {
        getProductDetail(productID, headerToken).then(function(resultsObj) {
            if (resultsObj) {
                resultsObj.authToken = config.headers["authorization"];
                res.send (resultsObj);
            } else {
                console.log("No results for search");
                res.send ('No results for your search');
            }
        }).catch(function(err) {
            console.log(err);
            res.status(404).json({success: false, error: 'Encountered an Error'});
        });
    } catch (err) {
        console.error("Error fetching product details:", err);
        res.status(500).json({ success: false, error: 'Encountered an Error' });
    }
});

module.exports = router;