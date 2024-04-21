require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../model/users');
const Volunteer = require('../model/volunteer');
const DailyMotivation = require('../model/dailyMotivation');
const Donations = require('../model/donations');
const Mudras = require('../model/mudras'); 
const paymentController = require('../controllers/paymentController');


router.get('/', (req, res) => {
    res.render('index');
})

//login
router.get('/login', (req, res) => {
    res.render('login', { error: "" });
})

router.get('/signup', (req, res) => {
    res.render('signup', { error: "" });
})

router.get('/success-login', (req, res) => {
    res.render('success', { message: "You have been Successfully Logged In!" });
})

router.get('/user-not-found', (req, res) => {
    res.render('login', { error: "User not found" });
})

router.get('/wrong-password', (req, res) => {
    res.render('login', { error: "Wrong password" });
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
            console.log(user.id);
            req.session.userId = user.id;
            res.redirect('/success-login');
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Login failed" });
    }
})

//signup

router.get('/signup', async (req, res) => {
    res.render("signup");
})

router.get('/signup-success', (req, res) => {
    res.render('success', { message: "You have been Successfully Signed Up!" });
})

router.get('/signup-failed', (req, res) => {
    res.render('signup', { error: "Signup failed" });
})

router.get('/user-exists', (req, res) => {
    res.render('signup', { error: "Email Or Phone Already Exists" });
})

router.post('/signup', async (req, res) => {
    // console.log(req.body);
    try {
        const { name, password, phone, email } = req.body;
        const user = new User({ name, email, phone, password });
        console.log(user);
        await user.save();
        res.redirect('/signup-success');
    }
    catch (error) {
        if (error.code === 11000) {
            res.redirect('/user-exists');
        }
        else {
            console.log(error);
            res.redirect('/signup-failed');
        }
    }
});


router.get("/volunteer", (req, res) => {
    if (req.session.userId) {
        res.render('volunteer');
    }
    else {
        res.redirect('/login');
    }
})

router.get('/successVolunteer', (req, res) => {
    res.render('success', { message: "Thank You for filling this Form" });
})

router.post('/submitVolunteer', (req, res) => {
    const { name, email, phoneNumber, dateOfBirth, qualification, field } = req.body;
    console.log(name, email, phoneNumber, dateOfBirth, qualification, field)

    const volunteer = new Volunteer({ name: name, email: email, phoneNumber: phoneNumber, dateOfBirth: dateOfBirth, qualification: qualification, field: field, status: "0" });
    volunteer.save().then(() => {
        res.redirect('/successVolunteer')
    }).catch((err) => {
        res.json({ error: err });
    })
})

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
router.get("/dailyMotivation", (req, res) => {

    if (req.session.userId) {
        let today = new Date();
        let dateStr = today.toISOString().split('T')[0] + '.mp4';
        let colors = [];
        
        DailyMotivation.findOne({ videoName: dateStr }).then((todayVideo) => {
            DailyMotivation.find().then((videos) => {
                for (let i = 0; i < videos.length; i++) {
                    colors.push(getRandomColor());
                }
                Mudras.find().then((mudras) => {

                    res.render('motivation', { mudras :mudras, todayVideo: todayVideo,videos : videos.reverse(),colors:colors });
                });
                
            });
        });

    }
    else {
        res.redirect('/login');
    }
})

router.post('/donations/pay', paymentController.payDonations);

router.post('/save-pay-donations',async(req,res)=>{
    const {paymentId, donation_name,amount,userId } = req.body;
    try {
        const donation = await Donations.findOne(donation_name);

        if (!donation) {
            return res.status(404).json({ message: 'Donation or User not found' });
        }
        donation.users.push(userId);

        await donation.save();

        res.redirect('/donations');
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
    
    
})

router.get("/donations", (req, res) => {

    if (req.session.userId) {

        Donations.find().then((donations) => {
            User.findById(req.session.userId).then((user) => {
                        
                res.render('donations', { donations: donations, user : user });
            });
        }).catch((err) => {
            res.json({ error: err });
        })
    }
    else {
        res.redirect('/login');
    }
})


router.get("/aboutVivekJoshi", (req, res) => {

    if (req.session.userId) {
        res.render('aboutvivek');
    }
    else {
        res.redirect('/login');
    }
})


router.get("/differentlyAbleContactForm", (req, res) => {

    if (req.session.userId) {
        res.render('disabilityConnect');
    }
    else {
        res.redirect('/login');
    }
})


router.get("/connectWithUs", (req, res) => {

    if (req.session.userId) {
        res.render('connectWithUs');
    }
    else {
        res.redirect('/login');
    }
})


module.exports = router;