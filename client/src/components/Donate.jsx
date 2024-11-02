import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DonationBanner from '../assets/donations-banner.png';
import { AiOutlineDown } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Donate = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/donations');
        setDonations(response.data);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <div className="overflow-hidden w-full h-auto">
      <ToastContainer />
        <img src={DonationBanner} alt="Donations Banner" className="object-cover w-full h-full" />
      </div>

      <section className="mt-8 px-8">
        <div className="max-w-screen-xl mx-auto">
          <h1 className="text-center">Your Donation will Provide...</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {donations.map((donation, index) => (
              <DonationCard 
                key={index} 
                amount={donation.donation_fund} 
                description={donation.donation_description} 
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 mb-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="space-y-4">
            {donations.map((donation, index) => (
              <Accordion
                key={index}
                donationName={donation.donation_name}
                donationDescription={donation.donation_description}
                donationImageUrl={donation.donation_image_url || DonationBanner}
                donationAmount={donation.donation_fund}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

// Donation Card Component
const DonationCard = ({ amount, description }) => (
  <div className="bg-orange-400 text-white p-4 rounded-lg text-center">
    <h1>{amount}</h1>
    <p>{description}</p>
  </div>
);

// Accordion Component with Razorpay Integration
const Accordion = ({ donationName, donationDescription, donationImageUrl, donationAmount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  // Function to handle Razorpay payment
  const handleDonate = async () => {
    try {
      // Step 1: Create order on backend
      const response = await axios.post("http://localhost:5000/create-order", {
        amount: donationAmount
      });
      const { orderId, amount } = response.data;
  
      // Step 2: Initialize Razorpay
      const options = {
        key: "rzp_test_LVMfEY3Rs5STmn",
        amount: amount,
        currency: "INR",
        name: "Donation",
        description: `Donation for ${donationName}`,
        order_id: orderId,
        handler: async function (response) {
          // Step 3: Save the donation record on successful payment
          console.log(user._id);
          
          await axios.post("http://localhost:5000/save-donation", {
            orderId: orderId,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone
            },
            donationName: donationName,
            donationAmount: donationAmount
          });
          toast.success(`Donation successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        theme: {
          color: "#fb923c"
        }
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error in payment:", error.message);
    }
  };
  
  return (
    <div className="bg-orange-100 p-4 rounded-lg">
      <div className="flex items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-medium">{donationName}</span>
        <AiOutlineDown className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="mt-4">
          <div className="w-48 h-48 rounded-full overflow-hidden mx-auto">
            <img src={donationImageUrl} alt={donationName} className="w-full h-full object-cover" />
          </div>
          <p className="mt-4 text-center">{donationDescription}</p>
          <button 
            onClick={handleDonate} 
            className="mt-4 bg-orange-400 text-white py-2 px-4 rounded-lg"
          >
            Donate Now
          </button>
        </div>
      )}
    </div>
  );
};

export default Donate;
