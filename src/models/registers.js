require('dotenv').config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
// const createToken = async() => {
//     const token = await jwt.sign({_id:"64074894a2b6a84c44338592"}, "secretKeysecretKeysecretKeysecretKeysecretKeysecretKey");
//     console.log(token);
//     const userVer = await jwt.verify(token, "secretKeysecretKeysecretKeysecretKeysecretKeysecretKey");
//     console.log(userVer);
// }
console.log(process.env.SECRET_KEY);
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
    },
    tokens : [{
        token:{
            type: String,
            require: true
        }
    }]
})
employeeSchema.methods.generateAuthToken = async function() {
    try {
        const token = await jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        // console.log(token);
        return token;
    } catch (error) {
        res.send(error);
        console.log("the error is " + error);
    }
}
employeeSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        // const passwordHash = await bcrypt.hash(this.password, 10);
        this.password = await bcrypt.hash(this.password, 10);
        this.confirm_password = await bcrypt.hash(this.password, 10);
        // this.confirm_password = undefined;
    }
    next();
})

const Register = new mongoose.model("Register", employeeSchema)
module.exports = Register;

