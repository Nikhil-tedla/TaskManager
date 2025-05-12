import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import { register } from '../../api/Auth';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    adminInviteToken: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register(formData);
      navigate("/login")
      console.log('Registration success:', res.data);

      
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Register</h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Full name"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Admin Invite Token (Optional)</label>
            <input
              type="text"
              name="adminInviteToken"
              value={formData.adminInviteToken}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Token if you have one"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            Register
          </button>
          <p className='text-{13px} text-slate-800 mt-3'>Already had an account? 
            <Link className="font-medium text-success underline" to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
