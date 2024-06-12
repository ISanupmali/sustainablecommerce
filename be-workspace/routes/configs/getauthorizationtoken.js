/* Function to getAuthorization token */

// Fetch helpers from the commerce SDK
const { ClientConfig, Customer, helpers, slasHelpers, Search } = require("commerce-sdk");

// Create a configuration to use when creating API clients
var config = require('./config');

// demo client credentials, if you have access to your own please replace them below.
// do not store client secret as plaintext. Store it in a secure location.
const CLIENT_ID = "b19e12df-d55f-427a-bdba-6f49365ad4c8";
//const CLIENT_SECRET = "lpKIpY60AXlnWRLyiUmTxYO5pDmVYn4xxUkBqJtNaxs";
const ORG_ID = "f_ecom_zzky_009";
const SHORT_CODE = "kv7kzm78";
const SITE_ID = "RefArch";

/*
// Get a JWT to use with Shopper API clients, a guest token in this case
helpers.getShopperToken(config, { type: "guest" }).then(async (token) => {

    try {
        // Add the token to the client configuration
        config.headers["authorization"] = token.getBearerHeader();
    } catch (e) {
        // Print the status code and status text
        console.error(e);
        // Print the body of the error
        console.error(await e.response.text());
    }
}).catch(async (e) => {
    console.error(e);
    console.error(await e.response.text());
});
*/

// Get a JWT to use with Shopper API clients, a guest token in this case
slasHelpers.loginGuestUser(
		new Customer.ShopperLogin(config), 
		{ redirectURI: 'http://localhost:3000/callback' }
	).then(async (guestTokenResponse) => {

    try {
        // Add the token to the client configuration
		config.headers["authorization"] = 'Bearer '+guestTokenResponse.access_token;
		console.log("Guest Token Response: ", 'Bearer '+guestTokenResponse.access_token);
    } catch (e) {
        // Print the status code and status text
        console.error(e);
        // Print the body of the error
        console.error(await e.response.text());
    }
}).catch(async (e) => {
    console.error(e);
    console.error(await e.response.text());
});

module.exports = config;