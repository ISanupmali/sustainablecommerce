var express = require('express');
var router = express.Router();

/* Define the home page route. 
In future, we can send a Json with slot images and some marketing content. */

router.get('/', function(req, res) {
    res.send('You are on the Home Page');
});

module.exports = router;