var express = require('express');
var router = express.Router();

/* CORS for Cross Site origin requests. */
const cors = require('cors');
router.use(cors());
router.options('*', cors());
const allowOriginUrl = '*';

// Fetch helpers from the commerce SDK
const { ClientConfig, Customer, helpers, slasHelpers, Search } = require("commerce-sdk");

// Create a configuration to use when creating API clients
var config = require('./configs/config');

// demo client credentials, if you have access to your own please replace them below.
// do not store client secret as plaintext. Store it in a secure location.
const CLIENT_ID = "b19e12df-d55f-427a-bdba-6f49365ad4c8";
//const CLIENT_SECRET = "lpKIpY60AXlnWRLyiUmTxYO5pDmVYn4xxUkBqJtNaxs";
const ORG_ID = "f_ecom_zzky_009";
const SHORT_CODE = "kv7kzm78";
const SITE_ID = "RefArchGlobal";

// Get a JWT to use with Shopper API clients, a guest token in this case
const getAuthToken = async () => {
    const fetchedAuthToken = await slasHelpers.loginGuestUser(
		new Customer.ShopperLogin(config), 
		{ redirectURI: 'http://localhost:3000/callback' }
	).then( (guestTokenResponse) => {
        try {
            // Add the token to the client configuration
            config.headers["authorization"] = 'Bearer1 '+guestTokenResponse.access_token;
            return guestTokenResponse;
        } catch (e) {
            // Print the status code and status text
            console.error(e);
            // Print the body of the error
            console.error( e.response.text());
        }
    }).catch(  (e) => {
        console.error(e);
        console.error( e.response.text());
    });
    return fetchedAuthToken;
};

// Define the Auth Token Route to get a JWT Token for Transactions
router.get('/shopper/auth/:type', async function(req, res) {
    var userType = req.params.type;

    await getAuthToken()
    .then(guestTokenResponse => {
        var bearerToken = guestTokenResponse.access_token;
        res.send (bearerToken);
    })
    .catch(error => {
        console.error('Error getting token:', error);
    });

});

module.exports = router;