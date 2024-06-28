// Import necessary modules
const express = require('express');
const axios = require('axios');
const router = express.Router();

// Retrieve required configuration details
const config = require('../configs/adminApiConfig');

// Function to URL encode the data
const toUrlEncoded = obj =>
  Object.keys(obj)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]))
    .join('&');

// Extract headers from the configuration
const headers = config.headers;

// Define a route that calls the authentication service
router.get('/get-accesstoken', async (req, res) => {
  try {
    // Make a POST request to the authentication service to get a new access token
    const response = await axios.post(config.url, toUrlEncoded(config.data), { headers });
    console.log('[BE]adminApiToken.js :: New accessToken Generated: ' + response.data.access_token);

    // Extract the access token from the response
    const accessToken = response.data.access_token;

    // Respond with the newly generated token
    return res.send(accessToken);
  } catch (error) {
    // Log the error and respond with a 500 status code if an error occurs
    console.error('[BE]adminApiToken.js :: Error occurred while generating token:', error);
    res.status(500).send('Error occurred while generating token');
  }
});

// Export the router
module.exports = router;
