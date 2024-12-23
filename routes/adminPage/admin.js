const { Router } = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const users = require('../../scheme/users');
const router = Router();

router.use('/', (req, res, next) => {
    const user = req.user; 
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


module.exports = router;