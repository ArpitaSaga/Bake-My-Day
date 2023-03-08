const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
require("./db/conn")
const Register = require("./models/registers.js");
const Order = require("./models/order.js");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" )
const template_path = path.join(__dirname, "../templates/views" )
const partials_path = path.join(__dirname, "../templates/partials" )
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path)
app.use(express.static(static_path));


const jwt = require('jsonwebtoken');


app.get('/', (req, res) => {
    if(req.cookies.jwt)
        res.render('home')
    else
        res.render('home1')
})
app.get("/signin", (req, res) => {
    res.render('signIn');
});
app.post("/signin", async (req, res) => {
    try {
        const password = req.body.password;
        const number = req.body.number;
        
        const user = await Register.findOne({number: number});
        const isMatch = await bcrypt.compare(password, user.password);
        const token = await user.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 30000000000000),
            httpOnly:true,
        });
        // console.log(cookie);
        // console.log("token is " + token);
        if (user != null && isMatch) {

            res.status(201).render("home", { jwt: true })
        } else {
            // document.getElementById("error").innerHTML = "*invalid login details";
            res.render("signIn2");
        }
    } catch (error) {
        res.status(400).render("signIn2");
    }
});

app.get("/signup", (req, res) => {
    res.render('signUp');
});
app.post("/signup", async (req, res) => {
    try {
        const number = req.body.number;
        const password = req.body.password;
        const cpassword = req.body.confirm_password;
        const user = await Register.findOne({number: number});
        if (user != null && user.number === number) {
            res.render("signUp3");
        } else {
            if (password === cpassword) {
                const registerEmployee = new Register({
                    number : req.body.number,
                    username : req.body.username,
                    password : password ,
                    confirm_password : cpassword
                }) 
                //password hash
                //middleware
                const token = await registerEmployee.generateAuthToken();
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 30000000000000),
                    httpOnly:true,
                });
                
    
                const registered = await registerEmployee.save();
                res.status(201).render("home");
    
            } else {
                res.render("signUp2");
            }
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).send("someerror");
    }
});


app.get("/customize_cake", auth, (req, res) => {
    res.render('custumeForm');
});
app.get("/contact", (req, res) => {
    res.render('contactView');
});
app.get("/faq", (req, res) => {
    res.render('faqView');
});
app.post("/customize_cake", async (req, res) => {
    try {
        
        const order = new Order({
            first : req.body.first,
            last : req.body.last,
            email : req.body.email,
            number : req.body.number,
            date : req.body.date,
            time : req.body.time,
            address : req.body.address,
            size : req.body.size,
            flavors : req.body.flavors,
            filling : req.body.filling,
            details : req.body.details
        })
        const orderList = await order.save();
        res.status(201).render("confirmation");
    } catch (error) {
        console.log(error);
        res.status(400).send("someerror");
    }
});
app.get("/menu", (req, res) => {
    res.render('menuList');
});
app.get("/confirmation", auth, (req, res) => {
    res.render('confirmation');
});

app.get("/wishlist", auth, (req, res) => {
    res.render('wishlist');
});
app.get("/purchase_history", auth, (req, res) => {
    res.render('purchase');
});
app.get("/profile", auth, (req, res) => {
    res.render('profile');
});
app.get("/profile_edit", (req, res) => {
    res.render('profile_edit');
});

app.get("/order_details", auth, (req, res) => {
    res.render('order_details');
});
app.get("/order_confirm", auth, (req, res) => {
    res.render('confirmation');
});
app.get("/cart", auth, (req, res) => {
    res.render('cart');
});
app.get("/signout", auth, async(req, res) => {
    try {
        // req.user.tokens = req.user.tokens.filter((currElement) => {
        //     return currElement.token !== req.token;
            
        // })
        console.log(req.username);
        res.clearCookie("jwt");
        // res.clearCookie("jwt");
        await req.user.save();
        res.render('home1');
    } catch (error) {
        res.render('signin')
    }
    
});


app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);

});