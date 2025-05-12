import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { Link } from 'react-router-dom';
import { setAuthToken } from '../../api/api';
import { getUserProfile, login } from '../../api/Auth';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { setUser } = useAuth();
  const navigate= useNavigate();
  

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await login(formData); 
        
      const { token,role } = res.data;

      
      localStorage.setItem('token', token);
      setAuthToken(token);
      
      
      const userProfile = await getUserProfile();
      //console.log(userProfile);
      setUser(userProfile);
      // setUser(user);
      if(role==="admin"){
        navigate('/admin/dashboard');
      }
      if(role==="member"){
        navigate('/user/dashboard')
      }
      
      

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.log(err);
      
    } 
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-600 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <button
          type="submit" 
          
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
            Login
        </button>
        <p className='text-{13px} text-slate-800 mt-3'>Didn't had an account? 
            <Link className="font-medium text-success underline" to="/register">signup</Link>
          </p>
      </form>
    </div>
  );
};

export default Login;
