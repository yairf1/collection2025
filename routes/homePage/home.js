const { Router } = require("express");
const path = require("path");
const router = Router();

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/homePage/home.html')
    res.sendFile(file);
})

router.post('/getAllProducts', (req, res) => {
    
})

module.exports = router;