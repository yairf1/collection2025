const mongoose = require('mongoose');

const products = {
    productName: {
        type: String,
        require: true,  
    },
    colors: {
        type: String,
    },
    price: {
        type: Number,
        default:0,
    },
    sizes: {
        type:Array,
        default:[],
    },
    img: {
        type: String,
        default: '#',
    },
}

module.exports = mongoose.model('#',products);