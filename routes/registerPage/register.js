const { Router } = require("express");
const path = require("path");
const router = Router();

router.get('/',(req,res) => {
    const file = path.join(__dirname + '../../../public/registerPage/register.html')
    res.sendFile(file);
})

//body:`name=${name}&password=${password}&clas=${clas}&phone=${phone}&email=${email}`

router.post('/createUser', async(req,res) => {
    const {name, password, clas, phone, email} = req.body;

    if (name && password && clas && phone && email ) {
        try{
            await users.create({name: name, password: password, class: clas, phone: phone, email: email, registerDate:getCurrentDate()});
            return res.send('user created successfully');
        }
        catch(err){
            console.error(err);
            return res.send('something went wrong, try again');
        }
    }
})

function getCurrentDate() {
    let now = new Date();
    let date = now.toLocaleDateString();
    return `${date}`;
}

module.exports = router;