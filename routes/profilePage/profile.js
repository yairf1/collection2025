const { Router } = require("express");
const path = require("path");
const users = require('../../scheme/users');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const authenticateToken = require('../middleware/checkAuth');
const router = Router();

router.use(cookieParser());
router.use(bodyParser.json());

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/profilePage/profile.html')
    res.sendFile(file);
})

router.get('/getUserDetails', authenticateToken, async (req, res) => {
    try{
        let loggedUser = await users.findOne({name: req.user.name});
        console.log(loggedUser);
        res.json({name: loggedUser.name, clas: loggedUser.class, phone: loggedUser.phone, email: loggedUser.email});
    }catch(err){
        console.error(err);
    }
});

router.post('/updateUserDetails', authenticateToken, (req, res) => {
    const { name, clas, phone, email } = req.body;
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