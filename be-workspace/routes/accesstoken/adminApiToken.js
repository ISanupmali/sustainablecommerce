const express = require('express');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const router = express.Router();

// Middleware to parse cookies
router.use(cookieParser());

// Retrieve required configuration details
var config = require('../configs/adminApiConfig');

// Function to URL encode the data 
const toUrlEncoded = obj => 
    Object.keys(obj).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&');

const headers = config.headers;

// Define a route that calls the authentication service
router.get('/get-accesstoken', async (req, res) => {
  try {
    let accessToken = req.cookies['accessToken1'];

    if (!accessToken) {
      const response = await axios.post(config.url, toUrlEncoded(config.data), { headers });
      console.log('[BE]adminApiToken.js :: New accessToken Generated: ' + response);
      accessToken = response.data.access_token;

      // Set token in a cookie
      res.cookie('accessToken', accessToken, { maxAge: 30 * 60 * 1000, httpOnly: true, secure: true }); // 30 minutes
    }

    // Respond with the existing token
    return res.send(accessToken);
  } catch (error) {
    console.error('[BE]adminApiToken.js :: Error occurred while generating token:', error);
    res.status(500).send('Error occurred while generating token');
  }
});

module.exports = router;
