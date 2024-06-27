/* Specify the API endpoints here */

// Import site configuration from config file
const config = require('./config');

// Define replacements object based on config values
const replacements = {
    shortCode: config.parameters.shortCode,           // Short code for the API
    organizationId: config.parameters.organizationId, // Organization ID
    siteId: config.parameters.siteId                  // Site ID
};

// Define API endpoints with placeholders for dynamic values
const apiEndpoints = {
    updateCouponCodes: 'https://{shortCode}.api.commercecloud.salesforce.com/pricing/coupons/v1/organizations/{organizationId}/coupons/{couponId}/codes?siteId={siteId}'
};

/**
 * Replaces placeholders in a given URL with actual values from replacements object.
 * 
 * @param {string} url - The URL containing placeholders.
 * @param {object} replacements - The object containing key-value pairs for replacement.
 * @returns {string} - The URL with placeholders replaced by actual values.
 */
function replaceUrlPlaceholders(url, replacements) {
    return url.replace(/{(\w+)}/g, (_, key) => {
        // Check if key exists in replacements object
        if (replacements.hasOwnProperty(key)) {
            return replacements[key];
        } else {
            // Placeholder not found in replacements, return original placeholder
            console.error('[BE]apiEndpoints.js :: replaceUrlPlaceholders : Please provide key ' + key);
            return `{${key}}`;
        }
    });
}

/**
 * Creates a dynamic URL by merging replacements with additional data and replacing placeholders.
 * 
 * @param {string} apiEndpoint - The key of the API endpoint in apiEndpoints object.
 * @param {object} [additionalData={}] - Additional key-value pairs to merge with replacements.
 * @returns {string} - The generated URL with placeholders replaced by actual values.
 */
function createUrl(apiEndpoint, additionalData = {}) {
    // Merge replacements with additionalData, if any
    const mergedReplacements = { ...replacements, ...additionalData };
    return replaceUrlPlaceholders(apiEndpoints[apiEndpoint], mergedReplacements);
}

// Exporting functions and objects for external use
module.exports = {
    createUrl,              // Function to create a dynamic URL
    apiEndpoints,           // Object containing API endpoint URLs
    replaceUrlPlaceholders  // Function to replace placeholders in URLs
};
