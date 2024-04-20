const Razorpay = require('razorpay');
const users = require('../model/users');
const { RAZORPAY_KEY_ID, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_SECRET_KEY
});


const payDonations = async (req, res) => {
    try {
        const amount = req.body.donation_fund * 100
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: 'razorUser@gmail.com'
        }

        console.log(req.body);

        const userId = req.body.userId; // Changed from res.body.userId to req.body.userId
        users.findById(userId).then(user =>{
            
            razorpayInstance.orders.create(options,
                (err, order) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({ success: false, msg: 'Error creating order' });
                    }

                    res.status(200).send({
                        success: true,
                        msg: 'Donation done Successfully',
                        order_id: order.id,
                        amount: amount,
                        key_id: RAZORPAY_KEY_ID,
                        product_name: req.body.donation_name,
                        description: req.body.donation_description,
                        contact: req.body.contact,
                        name: req.body.name,
                        email: req.body.email
                    });

                });
            });
        } catch (error) {
            console.log(error.message);
        }
}


module.exports = {
    payDonations
}