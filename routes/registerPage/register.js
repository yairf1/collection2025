const { Router } = require("express");
const path = require("path");
const users = require('../../scheme/users');
require('dotenv').config();
const router = Router();
const { body, validationResult } = require('express-validator');

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/registerPage/register.html')
    res.sendFile(file);
})

router.post('/createUser',[
    body('name').notEmpty().custom(async(value, {req}) => {
        try {
            const user = await users.findOne({name: req.body.name});
            if(user){ return false }
        } catch (error) { console.error(error)}
    }).withMessage('Username is required and must be unique'),
    body('password').notEmpty().withMessage('Invaild password'),
    body('clas').isInt({ min: 7, max: 13 }).withMessage('Clas must be a number between 7 and 13'),
    body('phone').isMobilePhone('any').withMessage('Phone must be a valid mobile number'),
    body('email').isEmail().notEmpty().withMessage('Invalid email'),
], async(req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {name, password, clas, phone, email} = req.body;

    if (name && password && clas && phone && email ) {
        try{
            await users.create({name: name, password: password, class: clas, phone: phone, email: email, registerDate:getCurrentDate()});
            return res.json({message: 'user created successfully'});
        }
        catch(err){
            console.error(err);
            return res.json({message: 'something went wrong, try again'});
        }
    }
})

function getCurrentDate() {
    let now = new Date();
    let date = now.toLocaleDateString();
    return `${date}`;
}

module.exports = router;