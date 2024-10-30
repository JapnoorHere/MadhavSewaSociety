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
router.use(expressFileUpload());

const { initializeApp } = require("firebase/app");
const { getStorage, ref, getDownloadURL, uploadBytesResumable } = require("firebase/storage");


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
    res.render('index',{userId : req.session.userId});
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
        req.session.userId = user.id;
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
        res.json({msg : 'success'})
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


router.post('/save-pay-donations', async (req, res) => {
    const { paymentId, donation_name, amount, userId } = req.body;
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
