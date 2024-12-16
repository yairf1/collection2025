//=========== requires =============
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index')
const path = require('path'); 
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 3003;


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use('/',router);

// mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
// .then(()=>console.log("connected to db"))
// .catch(err=>console.error(err));

app.listen(PORT, ()=>{
    console.log("app is listening in port " + PORT)
})
