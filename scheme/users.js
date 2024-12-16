const mongoose = require('mongoose');

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

}

module.exports = mongoose.model('#',users);