const { Router } = require("express");
const path = require("path");
const users = require('../../scheme/users');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authenticateToken = require('../middleware/checkAuth');
const router = Router();
const { body, validationResult } = require('express-validator');
const JWT_SECRET = process.env.SECERET_KEY;  


router.use(cookieParser());
router.use(bodyParser.json());
router.use(authenticateToken);

router.get('/', (req,res) => {
    if (req.isAuthenticated) {
        const file = path.join(__dirname + '../../../public/profilePage/profile.html')
        res.sendFile(file);
    } else {
      res.redirect('/error');
    }
})

router.get('/getUserDetails', async (req, res) => {
    try{
        let loggedUser = await users.findOne({name: req.user.name});
        res.json({name: loggedUser.name, clas: loggedUser.class, phone: loggedUser.phone, email: loggedUser.email});
    }catch(err){
        console.error(err);
    }
});

router.post('/updateUserDetails', [
    body('name').notEmpty().withMessage('Username is required'),
    body('clas').isInt({ min: 7, max: 12 }).withMessage('Clas must be a number between 7 and 12'),
    body('phone').isMobilePhone('any').withMessage('Phone must be a valid mobile number'),
    body('email').isEmail().notEmpty().withMessage('Invalid email'),
], async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { name, clas, phone, email } = req.body;
    
    if (!name || !clas || !phone || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        await users.updateOne({name: req.user.name}, {name: name, class: clas, phone: phone, email: email});
        // claen old cookie with old user name
        res.clearCookie('token', {
            httpOnly: true,  
            secure: false,   
            sameSite: 'Strict',
            maxAge: 0,  
            path: '/'    
        });

        res.json({message: 'user updated successfully'});
    } catch (error) {
        console.error(error); 
        return res.status(400).json({ message: 'error' });
    }
});
  
module.exports = router;