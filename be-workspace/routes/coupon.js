// Import required modules
const express = require('express');
const axios = require('axios');
const router = express.Router();
const { nanoid } = require('nanoid'); // For generating unique IDs
const bodyParser = require('body-parser');
const apiEndpoints = require('./configs/apiEndpoints');

// Middleware for parsing request bodies
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

/**
 * Creates an authorization header using the provided token.
 * 
 * @param {Object} req - The request object containing the access token.
 * @returns {string} The authorization header.
 */
function createAuthHeader(req) {
  return req.body && req.body.accessToken ? 'Bearer ' + req.body.accessToken : '';
}

/**
 * Gets the URL for updating coupon codes based on the discount value.
 * 
 * @param {number} discount - The discount percentage.
 * @returns {string} The URL for updating coupon codes.
 */
function getUpdateCouponCodesUrl(discount) {
  const coupon = {
    5: '5PercentOffCoupoun',
    10: '10PercentOffCoupoun',
    15: '15PercentOffCoupoun',
    20: '20PercentOffCoupoun',
    25: '25PercentOffCoupoun',
  };
  const additionalData = {
    couponId: coupon[discount]
  };
  return apiEndpoints.createUrl('updateCouponCodes', additionalData);
}

/**
 * Creates a result object.
 * 
 * @param {string} status - The status code.
 * @param {string} msg - The message.
 * @param {string} error - The error message.
 * @param {string} couponCode - The generated coupon code.
 * @returns {Object} The result object.
 */
function result(status, msg, error, couponCode) {
  return {
    status: status,
    msg: msg,
    error: error,
    couponCode: couponCode
  };
}

/**
 * Sends a request to update coupon codes.
 * 
 * @param {string} headerToken - The authorization header token.
 * @param {number} discount - The discount percentage.
 * @param {string} couponCode - The generated coupon code.
 * @returns {Promise<object>} The response data from the API.
 * @throws {Error} If there is an error with the API request.
 */
async function updateCouponCodes(headerToken, discount, couponCode) {
  try {
    const options = {
      method: 'POST',
      url: getUpdateCouponCodesUrl(discount),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': headerToken
      },
      data: {
        codes: [couponCode]
      },
      maxRedirects: 20
    };

    const response = await axios(options);
    return response; // Return response data
  } catch (error) {
    throw error; // Throw error to be handled in the route
  }
}

/**
 * Route handler to update coupon codes.
 * Expects a JSON body with an accessToken and discount property.
 */
router.post('/updateCouponCodes', async function (req, res) {
  const headerToken = createAuthHeader(req); // Helper function to create the auth header
  const discount = req.body && req.body.discount ? req.body.discount : '';
  const couponCode = nanoid(); // Generate a unique coupon code
  try {
    const resultsObj = await updateCouponCodes(headerToken, discount, couponCode);
    console.log('[BE] coupon.js :: resultObj' + resultsObj);
    res.send(result('204', 'Coupon Generated', '', couponCode)); // Send success response
  } catch (err) {
    console.error('[BE] coupon.js :: Error details:', err); // Log the full error details
    if (err.response && err.response.status === 401) {
      res.send(result(err.response.status, '', err.response.data.detail, '')); // Handle 401 error
    } else if (err.response && err.response.status === 404) {
      res.send(result(err.response.status, '', err.response.data.detail, '')); // Handle 404 error
    } else {
      res.send(result('500', '', err, '')); // Handle other errors
    }
  }
});

// Export the router to be used in other modules
module.exports = router;
