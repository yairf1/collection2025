const { Router } = require("express");
const path = require("path");
const users = require('../../scheme/users');
const router = Router();

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/loginPage/login.html')
    res.sendFile(file);
})

router.post('/checkIfExist',async(req,res) =>{
    //check in data base
    const {email, password} = req.body;

    try{
        const user = await users.findOne({email: email});

        if (user.password == password) {
            // res.cookie('isLogged', 'true', {maxAge: 1000 * 60 * 60 * 24});
            // res.cookie('email', user.email, {maxAge: 1000 * 60 * 60 * 24});
            // res.cookie('firstName', user.firstName, {maxAge: 1000 * 60 * 60 * 24});
            res.json({flag:true, router:"/"});
        }else{
            res.json({flag:false, error:'password inncorrect, try again'});
        }
    }
    catch(err){
        console.error(err);
        return res.json({flag:false, error:'user not found, try again'});;
    }
});

module.exports = router;