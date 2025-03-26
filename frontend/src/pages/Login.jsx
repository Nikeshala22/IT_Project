import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // For demo purposes, using hardcoded credentials
    // In a real app, this would be handled by a backend authentication service
    if (formData.username === 'admin' && formData.password === 'admin') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else if (formData.username === 'user' && formData.password === 'user') {
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-purple-100">
        <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-purple-700 mb-2">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
              className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-100 text-sm">
              {error}
            </div>
          )}
          <button 
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 