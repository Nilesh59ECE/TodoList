import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://todo-list-backend-ivory.vercel.app/api/register', { name, email, phone, birthday, address, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const { data } = response;
      const { userId } = data;
  
      // Store userId in localStorage
      localStorage.setItem('userId', userId);
  
      // Redirect user to the home page
      navigate('/home');
    } catch (error) {
      console.log('Registration failed:', error);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = 'https://todo-list-backend-ivory.vercel.app/api/google';
  };
  

  return (
    <div className="w-11/12 max-w-[500px] h-[620px] overflow-y-auto px-10 py-10 rounded-3xl bg-white px-10 py-10 rounded-3xl border-2 border-gray-150">
      <h1 className="mt-7 text-5xl text-center justify-center font-semibold text-blue-900">Registration Page</h1>
      <p className="font-medium text-lg text-gray-500 mt-5">Welcome back! Please enter your details.</p>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className="text-lg font-medium">Name : </label>
          <input
            type="text"
            className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className="text-lg font-medium">Email : </label>
          <input
            type="email"
            className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className="text-lg font-medium">Phone : </label>
          <input
            type="number"
            className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className="text-lg font-medium">Date of birth : </label>
          <input
            type="date"
            className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Enter your date of birth (YYYY MM DD)"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
        </div>
        <div className='mb-4'>
          <label className="text-lg font-medium">Address : </label>
          <input
            text="text"
            className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label className="text-lg font-medium">Password : </label>
          <input
            type="password"
            className="w-full border-2 border-gray-100 rounded-xl p-3 mt-1 bg-transparent"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-8 flex flex-col gap-y-4">
          <button className="active:scale[.98] active:duration-75 hover:scale-[1.01] ease-in-out transition-all py-2 rounded-xl bg-red-500 text-white text-lg font-bold">Register</button>
          {/* <button
            type="button"
            onClick={handleGoogleRegister}
            className='flex items-center justify-center gap-2 active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-2  rounded-xl text-gray-700 font-semibold text-lg border-2 border-gray-100'>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.26644 9.76453C6.19903 6.93863 8.85469 4.90909 12.0002 4.90909C13.6912 4.90909 15.2184 5.50909 16.4184 6.49091L19.9093 3C17.7821 1.14545 15.0548 0 12.0002 0C7.27031 0 3.19799 2.6983 1.24023 6.65002L5.26644 9.76453Z" fill="#EA4335"/>
              <path d="M16.0406 18.0142C14.9508 18.718 13.5659 19.0926 11.9998 19.0926C8.86633 19.0926 6.21896 17.0785 5.27682 14.2695L1.2373 17.3366C3.19263 21.2953 7.26484 24.0017 11.9998 24.0017C14.9327 24.0017 17.7352 22.959 19.834 21.0012L16.0406 18.0142Z" fill="#34A853"/>
              <path d="M19.8342 20.9978C22.0292 18.9503 23.4545 15.9019 23.4545 11.9982C23.4545 11.2891 23.3455 10.5255 23.1818 9.81641H12V14.4528H18.4364C18.1188 16.0119 17.2663 17.2194 16.0407 18.0108L19.8342 20.9978Z" fill="#4A90E2"/>
              <path d="M5.27698 14.2663C5.03833 13.5547 4.90909 12.7922 4.90909 11.9984C4.90909 11.2167 5.03444 10.4652 5.2662 9.76294L1.23999 6.64844C0.436587 8.25884 0 10.0738 0 11.9984C0 13.918 0.444781 15.7286 1.23746 17.3334L5.27698 14.2663Z" fill="#FBBC05"/>
            </svg>
            Register with Google
          </button> */}
        </div>
      </form>
      <div className="mt-8 flex justify-center items-center">
        <p className="font-medium text-base">Already have an account?<Link to="/login" className="text-blue-500">Login</Link></p>
      </div>
    </div>
  );
}
