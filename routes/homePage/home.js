const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const products = require('../../scheme/products');
const orders = require('../../scheme/orders');
const authenticateToken = require('../middleware/checkAuth');
const { body, validationResult } = require('express-validator');

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

router.post('/addToCart', authenticateToken,[
    body('productName').custom(async(value, {req}) => {
        try {
            const products = await products.find();
            if(!products){ return false }
            if(!products.includes(value)){
                return false;
            }
        } catch (error) {console.error(error)}
    }).withMessage('product name must be valid'),
    body('quantity').notEmpty().isInt({min: 1,}).withMessage('quantity must be integer and more than 0'),
    body('price').custom(async(value, {req}) => {
        try {
            const product = await products.findOne({productName: req.body.productName});
            if(!product){ return false }
            if(product.price != value){
                return false;
            }
        }catch (error) {console.error(error)}
    }).withMessage('price must be valid'),
    body('color').custom(async(value, {req}) => {
        try {
            const product = await products.findOne({productName: req.body.productName});
            if(!product){ return false }
            if(!product.colors.includes(value)){
                return false;
            }
        }catch (error) {console.error(error)}
    }).withMessage('color must be valid'),
    body('size').custom(async(value, {req}) => {
        try {
            const product = await products.findOne({productName: req.body.productName});
            if(!product){ return false }
            if(!product.sizes.includes(value)){
                return false;
            }
        } catch (error) {console.error(error)}
    }).withMessage('size must be valid'),
], async(req,res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { productName, price, color, size, quantity } = req.body;
    if(!productName || !color || !size || !quantity){
        return res.status(400).json({message: 'all fields are required'});
    }
    if(quantity <= 0 || isNaN(quantity)){
        return res.status(400).json({message: 'quantity must be more than 0'});
    }
    // search if client have existing order and open new one if he havent
    try {
        let order = await orders.findOne({customerName: req.user.name});

        if(!order){
            await orders.create({products: {productName: productName, color: color, price: price, size: size, quantity: quantity}, customerName: req.user.name});
            return res.json({message: 'product added to cart succsessfully'});
        }

        if (order.isConfirmed) {     
            return res.json({message: 'you have already confirmed your order, you cant add more products'});
        }

        order = await orders.updateOne(
            {customerName: req.user.name}, 
            {$push: {products: [{productName: productName, price: price, quantity: quantity, color: color, size: size}]}},
        );
        if (order.modifiedCount === 0) {
            return res.json({ message: 'Order not found or not updated' });
        }
        return res.json({message: 'product added to cart succsessfully'});
    }catch(error){
        console.error(error);
        return res.json({message: 'something went wrong'});
    }
});

module.exports = router;