const { Router } = require("express");
const path = require("path");
const router = Router();

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/registerPage/register.html')
    res.sendFile(file);
})

module.exports = router;