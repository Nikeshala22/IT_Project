import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaDollarSign, FaBox, FaUsers, FaPlus, FaList, FaChartBar } from 'react-icons/fa';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalParts: 0,
    totalCustomers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch orders
        const ordersResponse = await axios.get('http://localhost:4000/api/orders');
        const orders = ordersResponse.data;
        
        // Fetch parts
        const partsResponse = await axios.get('http://localhost:4000/api/inventory/get-all-spareparts');
        const parts = partsResponse.data.spareParts;

        // Calculate stats
        setStats({
          totalOrders: orders.length,
          totalRevenue: orders.reduce((sum, order) => sum + order.totalAmount, 0),
          totalParts: parts.length,
          totalCustomers: new Set(orders.map(order => order.customerInfo.email)).size
        });

        // Get recent orders (last 5)
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-8">
        <div className="flex justify-center items-center min-h-[200px] text-purple-600">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mr-3"></div>
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-pink-50 p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-2">Admin Dashboard</h1>
        <p className="text-purple-600">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <FaShoppingCart className="text-2xl text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-600">Total Orders</h3>
              <p className="text-2xl font-semibold text-blue-800">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FaDollarSign className="text-2xl text-green-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-green-600">Total Revenue</h3>
              <p className="text-2xl font-semibold text-green-800">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FaBox className="text-2xl text-orange-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-orange-600">Total Parts</h3>
              <p className="text-2xl font-semibold text-orange-800">{stats.totalParts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:shadow-lg transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 rounded-xl">
              <FaUsers className="text-2xl text-pink-500" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-pink-600">Total Customers</h3>
              <p className="text-2xl font-semibold text-pink-800">{stats.totalCustomers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8 border border-purple-100">
        <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
          <h2 className="text-xl font-semibold text-purple-800">Recent Orders</h2>
          <Link 
            to="/admin/orders" 
            className="text-purple-600 hover:text-purple-800 font-medium inline-flex items-center gap-1 transition-colors"
          >
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gradient-to-r from-purple-50 to-pink-50 text-left">
                <th className="px-6 py-3 text-xs font-medium text-purple-700 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-xs font-medium text-purple-700 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-purple-700 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-purple-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-purple-700 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-100">
              {recentOrders.map(order => (
                <tr key={order._id} className="hover:bg-purple-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                    {order._id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                    {order.customerInfo.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-700">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link to="/order-admin" className="bg-white rounded-xl shadow-md p-6 border border-purple-100 hover:border-green-300 hover:shadow-lg transition-all group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-green-400 to-teal-400 rounded-xl group-hover:scale-110 transition-transform">
              <FaList className="text-2xl text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-1 group-hover:text-green-600">Manage Orders</h3>
              <p className="text-sm text-green-600 group-hover:text-green-500">View and manage all orders</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
