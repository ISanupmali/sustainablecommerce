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
var config = require('./configs/getauthorizationtoken.js');
var config1 = require('./configs/config');

function getCategoryListing(categoryID, headerToken){
    return new Promise(function(resolve, reject){
        
        try {
            config1.headers["authorization"] = headerToken;
            // Create a new ShopperSearch API client
            const searchClient = new Search.ShopperSearch(config1);

            // Search for the specified category id
            const searchResults = searchClient.productSearch({
                parameters: {
                    q: categoryID,
                    limit: 16
                }
            });
            resolve(searchResults);
        } catch(e) {
            reject(e);
        }
    });
}

function getRecommendations(categoryID){
    return new Promise(function(resolve, reject){
        
        try {    
            // Create a new ShopperSearch API client
            const searchClient = new Search.ShopperSearch(config);

            // Search for the specified category id
            const searchResults = searchClient.productSearch({
                parameters: {
                    q: categoryID,
                    limit: 3
                }
            });
            resolve(searchResults);
        } catch(e) {
            reject(e);
        }
    });
}

// Define the category listing page route / endpoint
router.get('/category/:id', function(req, res) {
    var categoryID = req.params.id;
    var headerToken = req.headers.authorization;

    getCategoryListing(categoryID, headerToken).then(function(resultsObj) {
        if (resultsObj.total) {
            const firstResult = resultsObj.hits[0];
            res.json (resultsObj);
        } else {
            console.log("No results for search");
            res.send ('No results for your search');
        }
    }).catch(function(err) {
        console.log(err);
    });
});

// Recommendations Widget Route / endpoint
router.get('/recommendations/:id', function(req, res) {
    var categoryID = req.params.id;

    getRecommendations(categoryID).then(function(resultsObj) {
        if (resultsObj.total) {
            const firstResult = resultsObj.hits[0];
            res.json (resultsObj);
        } else {
            console.log("No results for search");
            res.send ('No results for your search');
        }
    }).catch(function(err) {
        console.log(err);
    });
});

module.exports = router;