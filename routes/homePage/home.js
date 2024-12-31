const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const products = require('../../scheme/products');
const authenticateToken = require('../middleware/checkAuth');
const { STATUS_CODES } = require("http");

router.use(cookieParser());
router.use(bodyParser.json());
// router.use(authenticateToken);

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/homePage/home.html')
    res.sendFile(file);
})

router.get('/checkAuth', authenticateToken, (req,res) => {
    res.send('user logged');
})

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,  
      secure: false,   
      sameSite: 'Strict',
      maxAge: 0,  
      path: '/'    
    });    
    res.json({ message: 'logged out successfully' });
});
  
  
router.post('/getAllProducts', async (req, res) => {
    try {
        let productsList = await products.find();
        res.json(productsList);
    } catch (error) {
        console.error(error);
    }
})

module.exports = router;