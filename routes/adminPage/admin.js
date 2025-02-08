const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const users = require('../../scheme/users');
const products = require('../../scheme/products');
const orders = require('../../scheme/orders');
const authenticateToken = require('../middleware/checkAuth');
const router = Router();

router.use('/', authenticateToken, async (req, res, next) => {
    const user = await users.findOne({name: req.user.name}); 
    if (user && user.isAdmin){
        next();
    } else {
        res.status(403).redirect('/error');
    }
});

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/adminPage/temp.html'); //====need to change to admin.html====
    res.sendFile(file);
});

router.get('/getAll', async (req, res) => {
    const toGet = req.query.toGet;
    try {
        let list = await (toGet === 'orders' ? orders : toGet === 'users' ? users : products).find();
        if(!list) {return res.json({message: 'object not found'})}
        res.json(list);
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

//orders

router.post('/deleteOrder', async (req, res) => {
    const {orderId} = req.body;
    try {
        let order = await orders.findOne({_id: orderId});
        if(!order) {return res.json({message: 'order not found'})}
        if(order.isPayed) {return res.json({message: 'cannot delete payed order'})}
        await orders.deleteOne({_id: orderId});
        
        res.json({message: 'order deleted successfully'});
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

router.post('/markPayed', async (req, res) => {
    const {orderId} = req.body;
    try {
        let order = await orders.findOne({_id: orderId});
        if(!order) {return res.json({message: 'order not found'})}
        order.isPayed = order.isPayed ? false : true;
        await order.save();
        
        res.json({message: 'order updated successfully'});
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

router.post('/markReady', async (req, res) => {
    const {orderId} = req.body;
    try {
        let order = await orders.findOne({_id: orderId});
        if(!order) {return res.json({message: 'order not found'})}
        order.isReady = order.isReady ? false : true;
        await order.save();
        
        res.json({message: 'order updated successfully'});
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

//products

router.post('/createProduct', async(req,res) => {
    const {name, colors, price, sizes, type} = req.body;
    if (name && colors && price && sizes && type){
        try{
            await products.create({productName: name, colors: colors.split(',').map(item => item.trim()), price: price, sizes: sizes.split(',').map(item => item.trim()), img: `../img/${name}.jpg`, type: type});
            return res.send('product created successfully');
        }
        catch(err){
            console.error(err);
            return res.send('something went wrong, try again');
        }
    }
});

//users

module.exports = router;