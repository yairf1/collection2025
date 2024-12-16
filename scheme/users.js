const mongoose = require('mongoose');
const { type } = require('os');

const users = {
    name: {
        type: String,
        require: true,
        
    },
    password: {
        type: String,
        require: true,

    },
    class: {
        type: String,
        require: true,

    },
    phone: {
        type: String,
        require: true,
 
    },

}

module.exports = mongoose.model('#',users);