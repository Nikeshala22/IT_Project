import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FaSignInAlt, FaUser } from 'react-icons/fa';
import { useAuth } from '../../context/authContext/authContext';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
    if (currentUser) {
        navigate('/');
    }
    }, [currentUser, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isRegister) {
                // Register logic
                const response = await axios.post('http://localhost:4000/api/user/register', {
                    email: formData.email,
                    password: formData.password,
                    name: formData.name || formData.email.split('@')[0]
                });                // Auto login after registration
                if (response.data) {
                    login({
                        id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        isAdmin: response.data.isAdmin
                    }, response.data.token);

                    // Check if we need to redirect to a specific page after login
                    const returnTo = location.state?.returnTo || '/';
                    navigate(returnTo);
                }
            } else {
                // Login logic with real API
                const response = await axios.post('http://localhost:4000/api/user/login', {
                    email: formData.email,
                    password: formData.password
                }); if (response.data) {
                    login({
                        id: response.data._id,
                        name: response.data.name,
                        email: response.data.email,
                        isAdmin: response.data.isAdmin
                    }, response.data.token);

                    // Check if we need to redirect to a specific page after login
                    const returnTo = location.state?.returnTo || '/';
                    navigate(returnTo);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegister(!isRegister);
        setError(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-purple-100">
                <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center flex items-center justify-center gap-3">
                    <FaUser className="text-purple-600" />
                    {isRegister ? 'Create Account' : 'User Login'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isRegister && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-purple-700 mb-2">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange}
                                placeholder="Enter your name"
                                className="w-full px-4 py-2 rounded-lg border border-purple-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                            />
                        </div>
                    )}

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-purple-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Enter your email"
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
                        disabled={loading}
                        className="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                    >
                        <FaSignInAlt />
                        {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Login'}
                    </button>

                    <div className="text-center text-sm">
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
                        >
                            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;