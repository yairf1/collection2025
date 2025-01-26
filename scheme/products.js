const mongoose = require('mongoose');

const products = new mongoose.Schema({
    productName: {
        type: String,
        require: true,  
    },
    colors: {
        type: Array,
        default:[],
    },
    price: {
        type: Number,
        default:0,
        min: 0,
        require: true,
    },
    sizes: {
        type:Array,
        default:[],
    },
    img: {
        type: String,
        default: '#',
    },
    type:{
        type: String,
        default: '',
    }
})

module.exports = mongoose.model('products',products);