/* 
Specify the instance-specific configurations here.
Refer to the documentation on how to get these details for the Salesforce Commerce API 
*/

// Define the admin API configuration
const adminApiConfig = {
    // The URL to request an access token from Salesforce Commerce API
    url: 'https://account.demandware.com/dwsso/oauth2/access_token',
    
    // The headers for the request
    headers: {
        // Content type for the request
        'Content-Type': 'application/x-www-form-urlencoded',
        // Authorization header containing the Base64-encoded client ID and client secret
        'Authorization': 'Basic YjA2NWQzMTYtYmZiOS00OTA1LTllNTMtMDQ3NjE0MzcwZTllOmIxOWUxMmRmLWQ1NWYtNDI3YS1iZGJhLTZmNDkzNjVhZDRjOA=='
    },
    
    // The data to be sent in the request body
    data: {
        // Grant type for the OAuth2.0 token request
        grant_type: 'client_credentials',
        // Scope of the access token
        scope: 'SALESFORCE_COMMERCE_API:zzky_002 sfcc.promotions.rw sfcc.orders.rw'
    }
}

// Export the adminApiConfig object so it can be used in other modules
module.exports = adminApiConfig;
