import React, { useEffect, useRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const Login = () => {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const navigate = useNavigate();
    const [passwordVisibility, setPasswordVisibility] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        const email = emailRef.current.value;
        const password = passwordRef.current.value;

        // Validation
        if (!email) {
            toast.error('Email is required');
            return;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            toast.error('Email is not valid');
            return;
        } else if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            if (response.status >= 200 && response.status < 300) {
                toast.success('Login successful!');
                const userData = response.data.user;
                localStorage.setItem('user', JSON.stringify(userData));
                navigate('/');
            } else {
                toast.error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error:', error.response);
            const errorMessage = error.message;
            console.log(errorMessage);
        }
    };

    return (
        <div className='flex flex-col py-4 px-12 w-full h-full'>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
            <div className='flex items-center gap-2 self-end'>
                <p className='text-slate-400 cursor-pointer'>Don't have an account?</p>
                <button onClick={() => navigate('/auth/signup')} className='border bg-white border-orange-300 rounded-3xl px-6 py-2 hover:bg-orange-300 shadow-md hover:text-white transition-all'>
                    Signup
                </button>
            </div>
            <h1 className='text-4xl font-bold mt-4'>Madhav Sewa Society</h1>
            <p className='text-slate-500 mt-2 transition-all'>Login to your account</p>
            <form className='flex flex-col gap-4 mt-8' onSubmit={handleLogin}>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="email" className='font-semibold'>Email</label>
                    <input type="email" ref={emailRef} id='email' className='p-2 rounded-md border focus:outline-none focus:outline-orange-300' />
                </div>
                <div className='relative flex flex-col gap-2'>
                    <label htmlFor="password" className='font-semibold'>Password</label>
                    <input type={passwordVisibility ? 'text' : 'password'} ref={passwordRef} id='password' className='p-2 rounded-md border focus:outline-none focus:outline-orange-300' />
                    {passwordVisibility ? (
                        <FaEyeSlash onClick={() => setPasswordVisibility(!passwordVisibility)} className='absolute cursor-pointer self-end top-1/2 mx-4 my-2' />
                    ) : (
                        <FaEye onClick={() => setPasswordVisibility(!passwordVisibility)} className='absolute cursor-pointer self-end top-1/2 mx-4 my-2' />
                    )}
                </div>
                <button type="submit" className='mt-3 border w-1/2 self-center text-white bg-orange-300 rounded-md px-6 py-3 hover:bg-opacity-80 transition-all shadow-md'>
                    Login
                </button>
                <div className='flex items-center gap-2 mt-4'>
                    <p className='text-slate-400 cursor-pointer hover:text-slate-500 transition-all'>Continue with</p>
                    <button className='border text-white bg-red-600 rounded-3xl px-6 py-2 hover:bg-opacity-90 shadow-md transition-all'>Google</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
