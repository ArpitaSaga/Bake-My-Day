const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    first : {
        type: String,
        require: true
    },
    last : {
        type: String,
        require: true
    },
    email : {
        type: String,
        require: true
    },
    number : {
        type: String,
        require: true
    },
    date : {
        type: String,
        require: true
    },
    time : {
        type: String,
        require: true
    },
    address : {
        type: String,
        require: true
    },
    size : {
        type: String,
        require: true
    },
    flavors : {
        type: String,
        require: true
    },
    filling : {
        type: String,
        require: true
    },
    details : {
        type: String,
        require: false
    },
})


const Order = new mongoose.model("Order", orderSchema)
module.exports = Order;

