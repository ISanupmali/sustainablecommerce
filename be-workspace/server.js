var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(require('./routes/routes'));
app.use(require('./routes/categoryRoutes'));
app.use(require('./routes/productRoutes'));
app.use(require('./routes/cartRoutes'));
app.use(require('./routes/shippingbillingRoutes'));
app.use(require('./routes/paymentRoutes'));
app.use(require('./routes/orderRoutes'));
app.use(require('./routes/authTokenRoutes'));
app.use(require('./routes/StorePortal'));
app.use(require('./routes/accesstoken/adminApiToken'));
app.use(require('./routes/coupon'));

/* CORS for Cross Site origin requests. */
const cors = require('cors');
app.use(cors());
app.options('*', cors());
const allowOriginUrl = '*';

app.listen(8080);

module.exports = app;