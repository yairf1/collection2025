const mongoose = require('mongoose');

const orders = {
    productName: {
        type: String,
        require: true,  
    },
    color: {
        type: String,
    },
    price: {
        type: Number,
        default:0,
    },
    totalPrice: {
        type: Number,
        default:0,
    },
    sizes: {
        type:Array,
        default:[],
    },
}

module.exports = mongoose.model('#',orders);