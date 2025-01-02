const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const products = require('../../scheme/products');
const orders = require('../../scheme/orders');
const authenticateToken = require('../middleware/checkAuth');

router.use(cookieParser());
router.use(bodyParser.json());

router.get('/',authenticateToken, (req,res) => {
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

router.post('/getProductDetails', async (req, res) => {
    const { productName } = req.body;
    try {
        let product = await products.findOne({productName: productName});
        res.json(product);
    } catch (error) {
        console.error(error);
    }
})

router.post('/addToCart', authenticateToken, async (req, res) => {
    const { productName, price, color, size, quantity } = req.body;
    if(!productName || !color || !size || !quantity){
        return res.status(400).json({message: 'All fields are required'});
    }
    // search if client have existing order and open new one if he havent
    try {
        let order = await orders.findOne({customerName: req.user.name});

        if(!order){
            console.log('no order found, creating');
            
            await orders.create({products: {productName: productName, color: color, price: price, size: size, quantity: quantity}, customerName: req.user.name});
            return res.json({message: 'product added to cart succsessfully'});
        }

        console.log('updating existing order');
        order = await orders.updateOne(
            {customerName: req.user.name}, 
            {$push: {products: [{productName: productName, price: price, quantity: quantity, color: color, size: size}]}},
        );
        if (order.modifiedCount === 0) {
            return res.json({ message: 'Order not found or not updated' });
        }
        return res.json({message: 'product added to cart succsessfully'});
    }catch(error){
        console.log(error);
        return res.json({message: 'something went wrong'});
    }
});

module.exports = router;