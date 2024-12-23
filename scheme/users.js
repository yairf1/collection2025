const mongoose = require('mongoose');

const users = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        
    },
    password: {
        type: String,
        require: true,

    },
    class: {
        type: Number,
        require: true,

    },
    phone: {
        type: String,
        require: true,
 
    },
    email: {
        type: String,
        require: true,
 
    },
    isAdmin: {
        type: Boolean,
        require: true,
        default: false,
    },

})

module.exports = mongoose.model('usersSite',users);