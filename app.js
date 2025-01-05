//=========== requires =============
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index')
const path = require('path'); 
const app = express();
const PORT = 3003;
require('dotenv').config();

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/',router);

// mongoose.connect(process.env.MONGODB_URI)
// .then(()=>console.log("connected to db"))
// .catch(err=>console.error(err));

mongoose.connect('mongodb://localhost:27017/')
.then(()=>console.log("connected to db"))
.catch(err=>console.error(err));

app.listen(PORT, ()=>{
    console.log("app is listening in port " + PORT)
})
