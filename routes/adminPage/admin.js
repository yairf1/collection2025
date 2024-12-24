const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const users = require('../../scheme/users');
const products = require('../../scheme/products');
const authenticateToken = require('../middleware/checkAuth');
const router = Router();

router.use('/', authenticateToken, async (req, res, next) => {
    const user = await users.findOne({name: req.user.name});; 
    console.log(user);
    if (user && user.isAdmin){
        next();
    } else {
        res.status(403).redirect('/error');
    }
});

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/adminPage/admin.html');
    res.sendFile(file);
})

router.post('/createProduct', async(req,res) => {
    const {name, colors, price, sizes} = req.body;
    if (name && colors && price && sizes){
        try{
            console.log(colors, sizes);
            await products.create({productName: name, colors: colors.split(',').map(item => item.trim()), price: price, sizes: sizes.split(',').map(item => item.trim())});
            console.log('product created successfuly');
            return res.send('product created successfully');
        }
        catch(err){
            console.error(err);
            return res.send('something went wrong, try again');
        }
    }
})

module.exports = router;