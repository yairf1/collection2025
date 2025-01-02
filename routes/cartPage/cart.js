const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const products = require('../../scheme/products');
const authenticateToken = require('../middleware/checkAuth');

router.get('/', authenticateToken, (req,res) => {
    const file = path.join(__dirname + '../../../public/cartPage/cart.html')
    res.sendFile(file);
})

module.exports = router;