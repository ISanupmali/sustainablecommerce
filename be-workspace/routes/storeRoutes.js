
const express = require('express');
const router = express.Router();

/* CORS for Cross Site origin requests. */
const cors = require('cors');
router.use(cors());
router.options('*', cors());
const allowOriginUrl = '*';

// import Packages from "commerce-sdk" | Configurations to use while creating API Clients
const { Seller, ClientConfig, Customer, slasHelpers } = require("commerce-sdk");
// Create a configuration to use when creating API clients. Also fetch the authorization token in the config obect.
var config = require('./configs/config');

function getStoreDetail(zipCode, headerToken){
    
    return new Promise(async function(resolve, reject){
      
        try {    
            config.headers["authorization"] = headerToken;

            // Create a new ShopperStores API client
            const shopperStoresClient = new Seller.ShopperStores(config);

            // Search for the specified product
            const storeResult = shopperStoresClient.searchStores({
                parameters: {
                    postalCode: zipCode,
                    countryCode: "US",
                    limit: 2
                    }
            });
            resolve(storeResult);
        } catch(e) {
            reject(e);
        }
    });
}

// Define the product detail page route / endpoint
router.get('/store', function(req, res) {
    var zipCode = req.query.zip;
    var headerToken = req.headers.authorization;

    try {
        getStoreDetail(zipCode, headerToken).then(function(resultsObj) {
            if (resultsObj) {
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
        console.error("Error fetching store details:", err);
        res.status(500).json({ success: false, error: 'Encountered an Error' });
    }
});

module.exports = router;