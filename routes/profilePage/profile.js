const { Router } = require("express");
const path = require("path");
const users = require('../../scheme/users');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authenticateToken = require('../middleware/checkAuth');
const router = Router();
const JWT_SECRET = process.env.SECERET_KEY;  


router.use(cookieParser());
router.use(bodyParser.json());

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/profilePage/profile.html')
    res.sendFile(file);
})

router.get('/getUserDetails', authenticateToken, async (req, res) => {
    try{
        let loggedUser = await users.findOne({name: req.user.name});
        res.json({name: loggedUser.name, clas: loggedUser.class, phone: loggedUser.phone, email: loggedUser.email});
    }catch(err){
        console.error(err);
    }
});

router.post('/updateUserDetails', authenticateToken, async (req, res) => {
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
        // create new cookie with updated user name
        // const token = jwt.sign({name: name}, JWT_SECRET, { expiresIn: "1h" });
        // res.cookie('token', token, {
        //   httpOnly: true,
        //   secure: false,
        //   sameSite: 'Strict',
        //   maxAge: 3600000,
        // });
        res.json({message: 'user updated successfully'});
    } catch (error) {
        console.error(error); 
    }
  });

// function authenticateToken(req, res, next) {
//     const token = req.cookies.token;
  
//     if (!token) return res.status(401).json({ message: 'Not logged in' });
  
//     jwt.verify(token, JWT_SECRET, (err, user) => {
//       if (err) return res.status(403).json({ message: 'Invalid or expired token' });
  
//       req.user = user;
//       next();
//     });
// }
  
module.exports = router;