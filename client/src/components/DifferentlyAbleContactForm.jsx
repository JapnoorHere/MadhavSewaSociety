import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import DisabledPeople from '../assets/disablepeople.png';

const DifferentlyAbleContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        father: '',
        mother: '',
        gender: '',
        qualification: '',
        percentage: '',
        services: '',
        disability_certificate_img: null,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }

        try {
            const response = await fetch('http://localhost:5000/upload-differentlyAbleContactForm', {
                method: 'POST',
                body: form,
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            // Show success toast
            toast.success('Form submitted successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                father: '',
                mother: '',
                gender: '',
                qualification: '',
                percentage: '',
                services: '',
                disability_certificate_img: null,
            });
        } catch (error) {
            // Show error toast
            toast.error('Error submitting the form. Please try again.');
        }
    };

    return (
        <main className="flex flex-col">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <section className="relative h-screen flex items-center justify-center">
                <img
                    src={DisabledPeople}
                    alt="Description"
                    className="absolute inset-0 object-cover w-full h-full"
                />
                <div className="text-white p-5 md:p-10 absolute text-center">
                    <p className="text-gray-300 text-base md:text-lg mt-4"></p>
                </div>
            </section>

            <div className="form">
                <div className="form-container max-w-screen-lg mx-auto">
                    <div className="form-content m-5 md:m-10">
                        <h1 className="text-center text-2xl md:text-3xl underline">Tell Us About Yourself</h1>
                        <form onSubmit={handleSubmit} className="bg-orange-50 border-2 border-orange-400 rounded-lg p-5 w-full md:w-4/5 mx-auto mt-8 flex flex-col gap-4">
                            <input type="text" required placeholder="Name" name="name" value={formData.name} onChange={handleChange} className="p-3 rounded-lg border border-gray-300" />
                            <input type="email" required placeholder="Email" name="email" value={formData.email} onChange={handleChange} className="p-3 rounded-lg border border-gray-300" />
                            <input type="tel" required placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleChange} className="p-3 rounded-lg border border-gray-300" />
                            <input type="text" required placeholder="Father's Name" name="father" value={formData.father} onChange={handleChange} className="p-3 rounded-lg border border-gray-300" />
                            <input type="text" required placeholder="Mother's Name" name="mother" value={formData.mother} onChange={handleChange} className="p-3 rounded-lg border border-gray-300" />

                            <div className="genderr flex flex-col md:flex-row md:items-center mt-2">
                                <h5 className="mr-2">Gender:</h5>
                                <label className="flex items-center">
                                    <input type="radio" required value="male" name="gender" onChange={handleChange} className="mr-1" />
                                    Male
                                </label>
                                <label className="flex items-center ml-4">
                                    <input type="radio" required value="female" name="gender" onChange={handleChange} className="mr-1" />
                                    Female
                                </label>
                                <label className="flex items-center ml-4">
                                    <input type="radio" required value="other" name="gender" onChange={handleChange} className="mr-1" />
                                    Other
                                </label>
                            </div>

                            <textarea required name="qualification" placeholder="Education Qualification" rows="7" value={formData.qualification} onChange={handleChange} className="p-3 rounded-lg border border-gray-300"></textarea>
                            <input type="text" required name="percentage" placeholder="Percentage of Disability" value={formData.percentage} onChange={handleChange} className="p-3 rounded-lg border border-gray-300" />
                            <textarea required name="services" placeholder="Type of Services" rows="7" value={formData.services} onChange={handleChange} className="p-3 rounded-lg border border-gray-300"></textarea>

                            <div className="disableCertificate flex flex-col md:flex-row items-center">
                                <h5 className="mr-2">Upload your Disability Certificate:</h5>
                                <input required type="file" name="disability_certificate_img" onChange={handleChange} className="p-3 rounded-lg border border-gray-300 w-full md:w-1/2" />
                            </div>

                            <button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white rounded-lg py-2 mt-4 mx-auto">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default DifferentlyAbleContactForm;
