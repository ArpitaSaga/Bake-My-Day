const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    number : {
        type: String,
        require: true
    },
    username : {
        type: String,
        require: true
    },
    password : {
        type: String,
        require: true
    },
    confirm_password : {
        type: String,
        require: true
    }
})


const Register = new mongoose.model("Register", employeeSchema)
module.exports = Register;

