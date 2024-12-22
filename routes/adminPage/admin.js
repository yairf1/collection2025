const { Router } = require("express");
const path = require("path");
const users = require('../../scheme/users');
const router = Router();

router.use('/',(req,res,next) => {
    
})

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/adminPage/admin.html')
    res.sendFile(file);
})

module.exports = router;