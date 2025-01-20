//=========== requires =============
const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index')
const path = require('path'); 
const cookieParser = require('cookie-parser');
require('dotenv').config()
const app = express();
const PORT = 3000;


app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use('/',router);

// mongoose.connect(process.env.MONGODB_CONNECTION_STRING,)
// .then(()=>console.log("connected to db"))
// .catch(err=>console.error(err));

async function connectToDB() {
    const uri = process.env.MONGODB_CONNECTION_STRING;
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB Atlas!');
    } catch (error) {
        console.error('Failed to connect:', error);
    }
}

connectToDB();

app.listen(PORT, ()=>{
console.log("app is listening in port " +PORT)
})
