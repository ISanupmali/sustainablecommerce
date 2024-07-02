const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const shopperOrders = require ('../scripts/sdk/ShopperOrders');
const responseUtils = require ('../utils/ResponseUtils');

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

// Route to retrieve order using order ID
router.post('/getOrder', async function(req, res) {
    const { orderNo, token } = req.body.body; // Extract orderNo and token from request body

    try {
        const resultsObj = await shopperOrders.getOrder(orderNo, token);
        if (resultsObj) {
            res.send(responseUtils.resultObj('200', orderNo + ' found', resultsObj, false));
        } else {
            console.log("No results for Order");
            res.send(responseUtils.resultObj('404', orderNo + ' not found!', null, true));
        }
    } catch (err) {
        console.log('[BE] StorePortal.js :: getOrder: Error: ' + err);
        const status = err && err.response && err.response.status ? err.response.status : '';
        if (status == 404 || status == 403) {
            res.send(responseUtils.resultObj(status, orderNo + ' not found!', null, true));
        } else {
            res.send(responseUtils.resultObj(status, 'Exception Occured!', null, true));
        }
    }
});

module.exports = router;
