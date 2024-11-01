import React, { useState, useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const cPasswordRef = useRef(null);

    const [passwordVisibility, setPasswordVisibility] = useState(false);
    const [cPasswordVisibility, setCPasswordVisibility] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        const name = nameRef.current.value;
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        const cPassword = cPasswordRef.current.value;

        // Basic validation
        if (!name || !email || !password || !cPassword) {
            toast.error('All fields are required.');
            return;
        }

        if (password !== cPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        // Send data to the backend
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                toast.success('Signup successful! You can now log in.');
                navigate('/auth/login');
            } else {
                toast.error(data.message || 'Signup failed.');
            }
        } catch (error) {
            toast.error('An error occurred. Please try again.');
        }
    };

    return (
        <div className='flex flex-col py-4 px-12 w-full h-full'>
            <ToastContainer />
            <div className='flex items-center gap-2 self-end'>
                <p className='text-slate-400 cursor-pointer'>Already have an account?</p>
                <button onClick={() => navigate('/auth/login')} className='border bg-white border-orange-300 rounded-3xl px-6 py-2 hover:bg-orange-300 shadow-md hover:text-white transition-all'>Login</button>
            </div>

            <h1 className='text-4xl font-bold mt-4'>Madhav Sewa Society</h1>
            <p className='text-slate-500 mt-2 transition-all'>Register your account</p>

            <form className='flex flex-col gap-4 mt-8' onSubmit={handleSignup}>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="name" className='font-semibold'>Name</label>
                    <input type="text" id='name' ref={nameRef} className='p-2 rounded-md border focus:outline-none focus:outline-orange-300' />
                </div>

                <div className='flex flex-col gap-2'>
                    <label htmlFor="email" className='font-semibold'>Email</label>
                    <input type="email" ref={emailRef} id='email' className='p-2 rounded-md border focus:outline-none focus:outline-orange-300' />
                </div>

                <div className='relative flex flex-col gap-2'>
                    <label htmlFor="password" className='font-semibold'>Password</label>
                    <input type={`${passwordVisibility ? 'text' : 'password'}`} ref={passwordRef} id='password' className='p-2 rounded-md border focus:outline-none focus:outline-orange-300' />
                    {passwordVisibility ? (
                        <FaEyeSlash onClick={() => setPasswordVisibility(!passwordVisibility)} className='absolute cursor-pointer self-end top-1/2 mx-4 my-2' />
                    ) : (
                        <FaEye onClick={() => setPasswordVisibility(!passwordVisibility)} className='absolute cursor-pointer self-end top-1/2 mx-4 my-2' />
                    )}
                </div>

                <div className='relative flex flex-col gap-2'>
                    <label htmlFor="cpassword" className='font-semibold'>Confirm Password</label>
                    <input type={`${cPasswordVisibility ? 'text' : 'password'}`} ref={cPasswordRef} id='cpassword' className='p-2 rounded-md border focus:outline-none focus:outline-orange-300' />
                    {cPasswordVisibility ? (
                        <FaEyeSlash onClick={() => setCPasswordVisibility(!cPasswordVisibility)} className='absolute cursor-pointer self-end top-1/2 mx-4 my-2' />
                    ) : (
                        <FaEye onClick={() => setCPasswordVisibility(!cPasswordVisibility)} className='absolute cursor-pointer self-end top-1/2 mx-4 my-2' />
                    )}
                </div>

                <button className='mt-3 border w-1/2 self-center text-white bg-orange-300 rounded-md px-6 py-3 hover:bg-opacity-80 transition-all shadow-md'>Signup</button>

                <div className='flex items-center gap-2'>
                    <p className='text-slate-400 cursor-pointer hover:text-slate-500 transition-all'>Create account with</p>
                    <button className='border text-white bg-red-600 rounded-3xl px-6 py-2 hover:bg-opacity-90 shadow-md transition-all'>Google</button>
                </div>
            </form>
        </div>
    );
};

export default Signup;
