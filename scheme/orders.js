const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    products: [
        {
            productName: {
                type: String,
                required: true,
            },
            color: {
                type: String,
            },
            price: {
                type: Number,
                default: 0,
                required: true,
            },
            size: {
                type: Array,
                default: [],
                required: true,
            },
            quantity: {
                type: Number,
                default: 1,
                required: true,
            },
        },
    ],
    totalPrice: {
        type: Number,
        default: 0,
    },
    customerName: {
        type:String,
        required: true,
    },
});

module.exports = mongoose.model('Order', orderSchema);