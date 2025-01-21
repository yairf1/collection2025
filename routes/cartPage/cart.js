const { Router } = require("express");
const path = require("path");
const router = Router();
const products = require('../../scheme/products');
const orders = require('../../scheme/orders');
const users = require('../../scheme/users');
const { body, validationResult } = require('express-validator');
const authenticateToken = require('../middleware/checkAuth');

router.get('/', authenticateToken, (req,res) => {
    const file = path.join(__dirname + '../../../public/cartPage/cart.html')
    res.sendFile(file);
})

router.delete('/removeOrder', authenticateToken, async(req, res) => {
    const user = req.user;
    try {
        await orders.deleteOne({customerName: user.name});
        res.json({message: 'order removed'});
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

router.post('/getUserOrder', authenticateToken, async (req, res) => {
    const user = req.user;
    let totalPrice = 0;
    try {
        let order = await orders.findOne({customerName: user.name});
        if(!order) {return res.json({message: 'order not found'})}
        // check if total price is correct
        order.products.forEach(product => {
            totalPrice += product.price * product.quantity;
        });
        if (totalPrice !== order.totalPrice) {
            order.totalPrice = totalPrice;
            await order.save();
        }
        res.json(order);
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
});

router.post('/confirmOrder', authenticateToken, async (req, res) => {
    const loggedUser = req.user;
    try {
        let order = await orders.findOne({customerName: loggedUser.name});
        let user = await users.findOne({name: loggedUser.name});
        order.isConfirmed = true;
        // generate order id
        order.orderId = generateOrderId(user.class, 6)   
        await order.save();
        res.json({message: 'order confirmed', orderId: order.orderId});
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
});

router.post('/updateOrder', authenticateToken, [
    body('quantity').notEmpty().isInt({min: 1,}).withMessage('quantity must be integer and more than 0'),
    body('color').custom(async(value, {req}) => {
        try {
            const productsTest = await products.findOne({productName: req.body.productName});
            if(!productsTest){ return false }
            if(!productsTest.colors.includes(value)){
                return false;
            }
        } catch (error) {console.error(error)}
    }).withMessage('color must be valid'),
    body('size').custom(async(value, {req}) => {
        try {
            const productsTest = await products.findOne({productName: req.body.productName});
            if(!productsTest){ return false }
            if(!productsTest.sizes.includes(value)){
                return false;
            }
        } catch (error) {console.error(error)}
    }).withMessage('size must be valid'),
], async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const user = req.user;
    const {index, quantity, color ,size} = req.body;
    try {
        let order = await orders.findOne({customerName: user.name});
        order.products[index].quantity = quantity;
        order.products[index].color = color;
        order.products[index].size = size;
        await order.save();
        res.json({message: 'order updated'});
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
});

router.post('/removeProduct', authenticateToken, async (req, res) => {
    const user = req.user;
    const { index } = req.body;

    try {
        const order = await orders.findOne({ customerName: user.name });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!Array.isArray(order.products) || index < 0 || index >= order.products.length) {
            return res.status(400).json({ message: 'Invalid product index' });
        }
        order.products.splice(index, 1);
        await order.save();
        
        if (order.products.length == 0) {
            await orders.deleteOne({ customerName: user.name})
        }
        res.json({ message: 'order updated' });
    } catch (error) {
        console.error('Error updating order:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

function generateOrderId(clas, length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let orderId;

    orderId = clas + '-';
    for (let i = 0; i < length; i++) {
        orderId += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return orderId;
}

module.exports = router;