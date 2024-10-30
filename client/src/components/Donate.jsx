import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios
import DonationBanner from '../assets/donations-banner.png';
import { AiOutlineDown } from 'react-icons/ai'; // Import arrow icon from react-icons

const Donate = () => {
  const [donations, setDonations] = useState([]); // State for donations
  const [loading, setLoading] = useState(true); // State for loading

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/donations'); // Adjust the URL based on your API structure
        setDonations(response.data); // Set the fetched donations to state
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch
      }
    };

    fetchDonations();
  }, []);

  if (loading) return <div>Loading...</div>; // Show loading indicator

  return (
    <main>
      {/* Banner Section */}
      <div className="overflow-hidden w-full h-auto">
        <img src={DonationBanner} alt="Donations Banner" className="object-cover w-full h-full" />
      </div>

      {/* Single Donations Section */}
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

      {/* Programme Donations Section */}
      <section className="mt-16 mb-16">
        <div className="max-w-screen-xl mx-auto">
          <div className="space-y-4">
            {donations.map((donation, index) => (
              <Accordion
                key={index}
                donationName={donation.donation_name} // Use the donation_name from the schema
                donationDescription={donation.donation_description} // Use the donation_description from the schema
                donationImageUrl={donation.donation_image_url || DonationBanner} // Use the donation_image_url or fallback to a default
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

// Accordion Component
const Accordion = ({ donationName, donationDescription, donationImageUrl }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    // Function to handle donation button click
    const handleDonate = () => {
      console.log(`Donated to ${donationName}`);
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
