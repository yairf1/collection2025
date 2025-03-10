const { Router } = require("express");
const router = Router();

const home = require('../routes/homePage/home');
const cart = require('../routes/cartPage/cart');
const profile = require('../routes/profilePage/profile');
const login = require('../routes/loginPage/login');
const register = require('../routes/registerPage/register');
const admin = require('../routes/adminPage/admin');
const error = require('../routes/errorPage/error');
const order = require('../routes/orderPage/order');
const about = require('../routes/aboutPage/about');


router.use('/',home);
router.use('/about',about);
router.use('/order',order);
router.use('/cart',cart);
router.use('/profile',profile);
router.use('/login',login);
router.use('/register',register);
router.use('/admin',admin);
router.use('/error',error);

module.exports = router;