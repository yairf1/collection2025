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
    const file = path.join(__dirname + '../../../public/adminPage/admin.html');
    res.sendFile(file);
});

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

router.post('/getAllOrders', async (req, res) => {
    try {
        let order = await orders.find();
        if(!order) {return res.json({message: 'order not found'})}
        res.json(order);
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

router.post('/deleteOrder', async (req, res) => {
    // const user = req.user;
    // try {
    //     let order = await orders.findOne({customerName: user.name});
    //     if(!order) {return res.json({message: 'order not found'})}
    //     if(order.isPayed) {return res.json({message: 'cannot delete payed order'})}
    //     await orders.deleteOne({customerName: user.name});
    //     res.json({message: 'order deleted successfully'});
    // } catch (error) {
    //     console.error(error);
    //     res.json({message: 'error'});
    // }
})

module.exports = router;