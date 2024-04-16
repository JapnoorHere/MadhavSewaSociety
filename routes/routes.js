const express = require('express');
const app = express();
const router = express.Router();
const User = require('../model/users');

router.get('/',(req,res)=>{
    res.render('index');
})

//login
router.get('/login',(req,res)=>{
    res.render('login',{error : ""});
})

router.get('/signup',(req,res)=>{
    res.render('signup',{error : ""});
})

router.get('/success-login',(req,res)=>{
    res.render('success',{message : "You have been Successfully Logged In!"});
})

router.get('/user-not-found',(req,res)=>{
    res.render('login',{error : "User not found"});
})

router.get('/wrong-password',(req,res)=>{
    res.render('login',{error : "Wrong password"});
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(req.body);
        console.log(user);
        if (!user) {
            res.redirect("/user-not-found");
        }
        else if (user.password !== password) {
            res.redirect("/wrong-password");
        }
        else {
            res.redirect('/success-login');
        }
    }
    catch {
        res.status(500).json({ error: "Login failed" });
    }
})

//signup

router.get('/signup', async (req, res) => {
    res.render("signup");
})

router.get('/signup-success',(req,res)=>{
    res.render('success',{message : "You have been Successfully Signed Up!"});
})

router.get('/signup-failed',(req,res)=>{
    res.render('signup',{error : "Signup failed"});
})

router.get('/user-exists',(req,res)=>{
    res.render('signup',{error : "Email Or Phone Already Exists"});
})

router.post('/signup', async (req, res) => {
    // console.log(req.body);
    try {
        const { name, password, phone, email } = req.body;
        const user = new User({ name, email,phone,password });
        console.log(user);
        await user.save();
        res.redirect('/signup-success');
    }
    catch (error){
        if(error.code === 11000){
            res.redirect('/user-exists');
        }
        else{
            console.log(error);
            res.redirect('/signup-failed');
        }
    }
});
module.exports = router;