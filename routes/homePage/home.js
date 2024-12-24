const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const router = Router();
const authenticateToken = require('../middleware/checkAuth');
const { STATUS_CODES } = require("http");

router.use(cookieParser());
router.use(bodyParser.json());

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/homePage/home.html')
    res.sendFile(file);
})

router.get('/checkAuth', authenticateToken, (req,res) => {
    console.log('user logged in');
    res.send('user logged');
})

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,  
      secure: false,   
      sameSite: 'Strict',
      maxAge: 0,  
      path: '/'    
    });
    console.log('logging out');
    
    res.json({ message: 'logged out successfully' });
});
  
  
router.post('/getAllProducts', (req, res) => {
    
})

module.exports = router;