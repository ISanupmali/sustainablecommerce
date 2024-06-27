var express = require('express');
var router = express.Router();
const bodyParser = require("body-parser");

/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
router.use(bodyParser.urlencoded({
    extended: true 
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
router.use(bodyParser.json());

const { Checkout } = require("commerce-sdk");
var config = require('./configs/config');

// The below function searches for an order and returns the order object
async function searchOrder(orderNo, headerToken) {
    try {
        // Set authorization header token in configuration
        config.headers["authorization"] = headerToken;

        // Create a new ShopperSearch API client
        const shopperOrdersClient = new Checkout.Orders(config);

        // Search for the specified order
        const searchResults = await shopperOrdersClient.getOrder({
            parameters: {
                "orderNo": orderNo,
                "organizationId": config.parameters.organizationId,
                "siteId": config.parameters.siteId
            }
        });
        return searchResults;
    } catch (e) {
        throw e;
    }
}

// Route to retrieve order using order ID
router.post('/getOrder', async function(req, res) {
    const { orderNo, token } = req.body.body; // Extract orderNo and token from request body

    try {
        const resultsObj = await searchOrder(orderNo, token);
        if (resultsObj) {
            res.send(resultsObj); // Send order details as JSON response
        } else {
            console.log("No results for Order");
            res.status(404).send('404 Not Found'); // Send 404 status if order not found
        }
    } catch (err) {
        console.log(err);
        if (err.message === '404 Not Found') {
            res.status(404).send('Order Not Found'); // Handle specific error message for order not found
        } else {
            res.status(500).send(err.message); // Handle other errors with 500 status
        }
    }
});

module.exports = router;
