require('dotenv').config();
const express = require('express');
const router = express.Router();
const expressFileUpload = require('express-fileupload');
const User = require('../model/users');
const Volunteer = require('../model/volunteer');
const DailyMotivation = require('../model/dailyMotivation');
const Donations = require('../model/donations');
const Mudras = require('../model/mudras');
const DifferentlyAbleContactForms = require('../model/differentlyAbleContactForm');
const path = require('path')
const Event = require('../model/events');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");


router.use(expressFileUpload());

const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");

router.use(bodyParser.json());

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


const firebaseConfig = {
    apiKey: "AIzaSyBn798z5IVXx6lV7V_rKfrj3Pbj30O_gaU",
    authDomain: "madhavsewasociety-31fb8.firebaseapp.com",
    projectId: "madhavsewasociety-31fb8",
    storageBucket: "madhavsewasociety-31fb8.appspot.com",
    messagingSenderId: "588888204355",
    appId: "1:588888204355:web:c51aba510f00591b5f20f6",
    measurementId: "G-SCEKMEZ3NL"
};

const firebaseApp = initializeApp(firebaseConfig);




router.get('/', (req, res) => {
    console.log(req.session.userId);
    res.render('index', { userId: req.session.userId });
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'User not available' });
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        // localStorage.setItem('token', token);
        // localStorage.setItem('user', JSON.stringify(user));
        res.json({ user, token, message: 'Login successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

router.post('/signup', async (req, res) => {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password || !phone) {
        return res.status(400).json({ message: 'Name, email, phone and password are required.' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(402).json({ message: 'User already exists with this email.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ name, email, phone, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});


router.get("/volunteer", (req, res) => {
    // if (req.session.userId) {
    res.render('volunteer');
    // }
    // else {
    // res.redirect('/login');
    // }
})

router.get('/successVolunteer', (req, res) => {
    res.render('success', { message: "Thank You for filling this Form" });
})

router.post('/submitVolunteer', (req, res) => {
    const { name, email, phoneNumber, dateOfBirth, qualification, field } = req.body;
    console.log(name, email, phoneNumber, dateOfBirth, qualification, field)

    const volunteer = new Volunteer({ name: name, email: email, phoneNumber: phoneNumber, dateOfBirth: dateOfBirth, qualification: qualification, field: field, status: "0" });
    volunteer.save().then(() => {
        res.json({ msg: 'success' })
    }).catch((err) => {
        res.json({ error: err });
    })
})

router.get("/dailyMotivation", (req, res) => {
    let today = new Date();
    let dateStr = today.toISOString().split('T')[0] + '.mp4'; // Getting today's date in the required format

    // Fetch today's video and all videos from the database
    DailyMotivation.findOne({ videoName: dateStr }).then((todayVideo) => {
        DailyMotivation.find().then((videos) => {
            Mudras.find().then((mudras) => {
                // Sending the response with the data required by the React component
                res.json({
                    todayVideo: todayVideo,
                    videos: videos.reverse(), // Reverse to show the latest videos first
                    mudras: mudras
                });
            }).catch(err => {
                console.error("Error fetching mudras:", err);
                res.status(500).json({ error: "Failed to fetch mudras" });
            });
        }).catch(err => {
            console.error("Error fetching videos:", err);
            res.status(500).json({ error: "Failed to fetch videos" });
        });
    }).catch(err => {
        console.error("Error fetching today's video:", err);
        res.status(500).json({ error: "Failed to fetch today's video" });
    });
});


router.post('/save-donation', async (req, res) => {
    const { orderId, user, donationName, donationAmount } = req.body;

    try {
        // Find or create a donation record
        let donation = await Donations.findOne({ donation_name: donationName });

        // if (!donation) {
        //     donation = new Donations({
        //         donation_name: donationName,
        //         donation_description: 'Description of donation', // Add details as needed
        //         donation_fund: donationAmount,
        //         donation_image_url: 'Image URL here' // Optional image for donation
        //     });
        // }
        
        // Add user details with donation time to the donation's users array
        donation.users.push({
            id: user.id,
            donation_date_time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })
        });

        // Save to MongoDB
        await donation.save();
        res.status(200).json({ message: 'Donation record saved successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save donation record' });
    }
});


router.post("/create-order", async (req, res) => {
    const { amount } = req.body; // Amount in rupees
    const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        receipt: `receipt_order_${Math.random() * 10000}`,
    };
    try {
        const order = await razorpay.orders.create(options);
        res.json({ id: order.id, amount: order.amount, currency: order.currency });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/donations", (req, res) => {
    // Directly fetch donations from the database
    Donations.find()
        .then((donations) => {
            // Send donations as JSON response
            res.json(donations);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
});


router.get("/aboutVivekJoshi", (req, res) => {

    // if (req.session.userId) {
    res.render('aboutvivek');
    // }
    // else {
    //     res.redirect('/login');
    // }
})

router.post('/upload-differentlyAbleContactForm', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const { name, email, phone, father, mother, gender, qualification, percentage, services } = req.body;
    const imgFile = req.files.disability_certificate_img;
    const imgExtension = path.extname(imgFile.name);
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, 'differentlyAbledContactForm/' + name + imgExtension);

    const metadata = {
        contentType: 'image/' + imgExtension.replace('.', '')
    };

    const uploadTask = uploadBytesResumable(storageRef, imgFile.data, metadata);
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
        },
        (err) => {
            console.error(err);
            return res.status(500).json({ message: 'File upload failed.', error: err });
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                const differentlyAbleContactForm = new DifferentlyAbleContactForms({
                    name,
                    email,
                    phone,
                    father,
                    mother,
                    gender,
                    qualifications: qualification,
                    services,
                    percentage,
                    img_url: downloadURL
                });

                differentlyAbleContactForm.save().then(() => {
                    return res.status(200).json({ message: 'Form submitted successfully!' });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).json({ message: 'Failed to save form data.', error: err });
                });
            });
        }
    );
});


router.get('/events', async (req, res) => {
    try {
        // Fetch all events from the database, sorted by the event date
        const events = await Event.find().sort({ date: 1 });
        res.json({ events });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Failed to fetch events' });
    }
});


module.exports = router;
