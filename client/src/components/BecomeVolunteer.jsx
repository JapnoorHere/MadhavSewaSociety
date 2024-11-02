import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Volunteer from "../assets/volunteer.jpg";

const BecomeVolunteer = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        qualification: '',
        field: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/submitVolunteer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Thank you for volunteering! You will be notified via email');
                setFormData({
                    name: '',
                    email: '',
                    phoneNumber: '',
                    dateOfBirth: '',
                    qualification: '',
                    field: ''
                });
            } else {
                throw new Error(data.error || 'Something went wrong');
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen flex items-center justify-center relative">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            
            {loading && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="loader w-16 h-16 border-t-4 border-white rounded-full animate-spin"></div>
                </div>
            )}

            <main className="py-12 px-4 lg:px-0">
                <section className="min-w-xl lg:px-[100px] mx-auto flex flex-col lg:flex-row-reverse items-center gap-10">
                    <div className="lg:w-1/2 h-full">
                        <img
                            src={Volunteer}
                            alt="Volunteer"
                            className="rounded-lg object-cover w-full shadow-lg"
                        />
                    </div>

                    <div className="lg:w-1/2 h-full bg-white p-8 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-800">
                                Take Action, Spread Kindness, Volunteer
                            </h1>
                            <hr className="my-6 border-gray-300" />
                            <p className="text-xl text-gray-600 mb-4">
                                Become a Volunteer and make a difference today.
                            </p>

                            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa85a] shadow-sm"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa85a] shadow-sm"
                                />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    placeholder="Phone Number"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa85a] shadow-sm"
                                />
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa85a] shadow-sm"
                                />
                                <textarea
                                    name="qualification"
                                    rows="4"
                                    placeholder="Qualifications"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa85a] shadow-sm"
                                ></textarea>
                                <select
                                    name="field"
                                    value={formData.field}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-4 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa85a] shadow-sm"
                                >
                                    <option value="">Choose one option</option>
                                    <option value="IT support">IT support</option>
                                    <option value="Event Management">Event Management</option>
                                    <option value="Teaching">Teaching</option>
                                    <option value="Music Instructor">Music Instructor</option>
                                    <option value="Dance Instructor">Dance Instructor</option>
                                    <option value="Art Instructor">Art Instructor</option>
                                </select>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-[#ffa85a] text-white font-semibold rounded-lg hover:bg-white hover:text-[#ffa85a] border-2 border-[#ffa85a] transition-colors duration-300"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default BecomeVolunteer;
