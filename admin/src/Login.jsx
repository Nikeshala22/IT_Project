import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GiAutoRepair } from 'react-icons/gi';
import { useAppContext } from './context/adminPackagesContext/appContex';

const Login = () => {
  const [state, setState] = useState('Sign Up');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const navigate = useNavigate();
  const { backendurl, setIsLoggedin, setUserData } = useAppContext(); // Use hook instead of AppContext()

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!backendurl) {
      toast.error('Backend URL is not configured. Please contact support.');
      return;
    }

    const maxRetries = 3;
    let attempt = 1;

    while (attempt <= maxRetries) {
      try {
        axios.defaults.withCredentials = true;

        if (state === 'Sign Up') {
          const { data } = await axios.post(`${backendurl}/api/auth/register`, {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          });

          if (data.success) {
            toast.success('Account created successfully!');
            setUserData(data.user); // Use data from backend response
            setIsLoggedin(true);
            setFormData({ name: '', email: '', password: '', role: '' });
            // Redirect based on role
            if(data.user.role === 'user') {
              navigate('/user');
            } else {
              navigate(`/${data.user.role}-dashboard`);
            }
            return;
          }
        } else {
          const { data } = await axios.post(`${backendurl}/api/auth/login`, {
            email: formData.email,
            password: formData.password,
          });

          if (data.success) {
            const role = data.user.role;
            const validRoles = ['inventoryadmin', 'appointmentadmin', 'orderadmin', 'jobsadmin'];

            if (!validRoles.includes(role) && role !== 'user') {
              toast.error('Invalid user role');
              return;
            }

            toast.success('Logged in successfully!');
            setUserData(data.user);
            setIsLoggedin(true);
            setFormData({ name: '', email: '', password: '' });

            // Navigate based on role
            switch (role) {
              case 'inventoryadmin':
                navigate('/inventoryadmin-dashboard');
                break;
              case 'appointmentadmin':
                navigate('/appointmentadmin-dashboard');
                break;
              case 'orderadmin':
                navigate('/orderadmin-dashboard');
                break;
              case 'jobsadmin':
                navigate('/jobs-dashboard');
                break;
              default:
                toast.error('Unknown role');
            }
            return;
          } else {
            toast.error(data.message || 'Login failed');
            return;
          }
        }
      } catch (error) {
        console.error(`Attempt ${attempt} - Error:`, error);
        if (error.code === 'ERR_NETWORK' && attempt < maxRetries) {
          attempt++;
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }

        if (error.code === 'ERR_NETWORK') {
          toast.error('Network error: Please ensure the backend is running.');
        } else if (error.response?.status === 401) {
          toast.error('Invalid email or password.');
        } else {
          toast.error(error.response?.data?.message || 'An error occurred.');
        }
        return;
      }
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{ backgroundImage: `url($})` }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>

      {/* Logo */}
      <div className="absolute top-8 left-8 sm:top-10 sm:left-12 flex items-center text-white text-2xl font-bold tracking-wider z-20 cursor-pointer">
        <GiAutoRepair className="text-[#006AFF] mx-2" />
        Wash AND Go
      </div>

      {/* Form Card */}
      <div className="relative w-full max-w-md p-8 bg-white rounded-xl shadow-2xl hover:shadow-[0_10px_20px_rgba(0,106,255,0.3)] transition-shadow duration-300 z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-extrabold text-gray-800 tracking-wide">
            {state === 'Sign Up' ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="mt-4 text-gray-600 text-base font-semibold">
            {state === 'Sign Up'
              ? 'Join WASH AN GO for top-notch vehicle services'
              : 'Login to access your account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {state === 'Sign Up' && (
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-transparent outline-none text-gray-700 transition-all duration-300"
                placeholder="Full Name"
                required
              />
            </div>
          )}
          {state === 'Sign Up' && (
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-transparent outline-none text-gray-700 transition-all duration-300"
                required
              >
                <option value="">Select Role</option>
                <option value="appointmentadmin">Appointment Admin</option>
                <option value="inventoryadmin">Inventory Admin</option>
                <option value="orderadmin">Order Admin</option>
                <option value="jobsadmin">Jobs Admin</option>
              </select>
            </div>
          )}
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-transparent outline-none text-gray-700 transition-all duration-300"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFF] focus:border-transparent outline-none text-gray-700 transition-all duration-300"
              placeholder="Password"
              required
            />
          </div>
          {state === 'Login' && (
            <div className="text-right">
              <span
                onClick={() => navigate('/reset-password')}
                className="text-sm text-[#006AFF] font-semibold cursor-pointer hover:underline transition-all duration-300"
              >
                Forgot Password?
              </span>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[#006AFF] text-white font-semibold rounded-lg hover:bg-[#0051CC] hover:shadow-lg transition-all duration-300 shadow-md"
          >
            {state === 'Sign Up' ? 'Sign Up' : 'Login'}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-6 text-sm font-medium">
          {state === 'Sign Up' ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            onClick={() => setState(state === 'Sign Up' ? 'Login' : 'Sign Up')}
            className="text-[#006AFF] font-semibold cursor-pointer hover:underline transition-all duration-300"
          >
            {state === 'Sign Up' ? 'Login' : 'Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;