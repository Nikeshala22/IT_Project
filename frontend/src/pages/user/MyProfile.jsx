import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaBox, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/authContext/authContext.jsx';

const MyProfile = () => {
    const { currentUser, logout } = useAuth();
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch user's orders if user is logged in
        if (currentUser) {
            fetchUserOrders();
        } else {
            setLoading(false);
        }
    }, [currentUser]);

    const fetchUserOrders = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get('http://localhost:4000/api/orders',);

            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch orders: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
    const handleLogout = () => {
        logout();
        window.location.href = '/';
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    if (!currentUser) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
                    <h2 className="text-2xl font-semibold text-purple-800 mb-4">Not Logged In</h2>
                    <p className="mb-6 text-purple-700">Please log in to view your profile and orders.</p>
                    <Link
                        to="/user/login"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-colors font-medium"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-purple-800 mb-8">My Profile</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 bg-white rounded-xl shadow-md p-6 border border-purple-100 h-fit">            <div className="flex flex-col items-center mb-6 pb-6 border-b border-purple-100">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl mb-3">
                            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <h2 className="text-xl font-semibold text-purple-800">{currentUser.name || 'User'}</h2>
                        <p className="text-purple-600 text-sm">{currentUser.email}</p>
                    </div>

                        <nav>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'profile'
                                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                                            : 'hover:bg-purple-50 text-purple-700'
                                            }`}
                                    >
                                        <FaUser className="mr-2" /> Profile
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('orders')}
                                        className={`w-full text-left px-4 py-2 rounded-lg flex items-center ${activeTab === 'orders'
                                            ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800'
                                            : 'hover:bg-purple-50 text-purple-700'
                                            }`}
                                    >
                                        <FaBox className="mr-2" /> My Orders
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 rounded-lg flex items-center text-red-600 hover:bg-red-50"
                                    >
                                        <FaSignOutAlt className="mr-2" /> Logout
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-purple-800">Profile Information</h2>
                                    <button className="flex items-center text-purple-600 font-medium hover:text-purple-800 transition-colors">
                                        <FaEdit className="mr-1" /> Edit
                                    </button>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-purple-600 mb-1">Full Name</h3>
                                        <p className="text-purple-800 font-medium">{currentUser.name || 'Not provided'}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-purple-600 mb-1">Email</h3>
                                        <p className="text-purple-800 font-medium">{currentUser.email}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-medium text-purple-600 mb-1">Member Since</h3>
                                        <p className="text-purple-800 font-medium">{currentUser.createdAt ? formatDate(currentUser.createdAt) : 'Unknown'}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'orders' && (
                            <div className="bg-white rounded-xl shadow-md p-6 md:p-8 border border-purple-100">
                                <h2 className="text-2xl font-semibold text-purple-800 mb-6">My Orders</h2>

                                {loading ? (
                                    <div className="flex justify-center items-center min-h-[200px] text-purple-600">
                                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
                                        <span className="text-lg">Loading orders...</span>
                                    </div>
                                ) : error ? (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
                                        {error}
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500">
                                        <FaBox className="mx-auto text-5xl mb-4 text-purple-300" />
                                        <h3 className="text-xl font-medium text-purple-800 mb-2">No Orders Yet</h3>
                                        <p className="text-purple-600 mb-6">You haven't placed any orders yet.</p>
                                        <Link
                                            to="/"
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-colors font-medium"
                                        >
                                            Browse Spare Parts
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="bg-gradient-to-r from-purple-50 to-pink-50">
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Order ID</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Total Amount</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-purple-100">
                                                {orders.map((order) => (
                                                    <tr key={order._id} className="hover:bg-purple-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                                                            {order._id.substring(0, 8)}...
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                                                            {formatDate(order.createdAt || order.orderDate)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                                                            ${order.totalAmount}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium
                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                                        order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                                                                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                                'bg-orange-100 text-orange-800'}`
                                                            }>
                                                                {order.status || 'Processing'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;