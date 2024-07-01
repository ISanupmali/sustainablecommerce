const { Checkout } = require("commerce-sdk");
const config = require('../../routes/configs/config');

/**
 * Fetches an order from the commerce system using the provided order number and authorization token.
 * @param {string} orderNo The order number to search for.
 * @param {string} headerToken The authorization token for API access.
 * @returns {Promise<object>} A promise that resolves with the order details if successful.
 * @throws {Error} If there's an error during the request or response handling.
 */
async function getOrder(orderNo, headerToken) {
    try {
        // Set authorization header token in configuration
        config.headers["authorization"] = headerToken;

        // Create a new Orders client from Commerce SDK using configured settings
        const shopperOrdersClient = new Checkout.Orders(config);

        // Search for the specified order using getOrder method from Commerce SDK
        const searchResults = await shopperOrdersClient.getOrder({
            parameters: {
                "orderNo": orderNo,
                "organizationId": config.parameters.organizationId,
                "siteId": config.parameters.siteId
            }
        });

        return searchResults;
    } catch (e) {
        // Throw any encountered errors to be handled by the caller
        throw e;
    }
}

// Exporting functions and objects to be used externally
module.exports = {
    getOrder
};
