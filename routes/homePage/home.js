const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
// const authCheck = require('../middleware/checkAuth');

router.use(cookieParser());
router.use(bodyParser.json());

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/homePage/home.html')
    res.sendFile(file);
})

router.post('/getAllProducts', (req, res) => {
    
})

module.exports = router;