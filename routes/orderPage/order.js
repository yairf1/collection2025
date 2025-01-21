const { Router } = require("express");
const path = require("path");
const router = Router();
const products = require('../../scheme/products');
const orders = require('../../scheme/orders');
const users = require('../../scheme/users');
const authenticateToken = require('../middleware/checkAuth');

router.get('/', authenticateToken, (req,res) => {
    const file = path.join(__dirname + '../../../public/orderPage/order.html')
    res.sendFile(file);
})

router.post('/getOrder', authenticateToken, async (req, res) => {
    const user = req.user;
    try {
        let order = await orders.findOne({customerName: user.name});
        if(!order) {return res.json({message: 'order not found'})}
        if(!order.isConfirmed) {return res.json({message: 'order not confirmed'})}
        res.json(order);
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

router.post('/deleteOrder', authenticateToken, async (req, res) => {
    const user = req.user;
    try {
        let order = await orders.findOne({customerName: user.name});
        if(!order) {return res.json({message: 'order not found'})}
        if(order.isPayed) {return res.json({message: 'cannot delete payed order'})}
        await orders.deleteOne({customerName: user.name});
        res.json({message: 'order deleted successfully'});
    } catch (error) {
        console.error(error);
        res.json({message: 'error'});
    }
})

module.exports = router;