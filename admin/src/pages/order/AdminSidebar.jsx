import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBox, FaClipboardList, FaHome, FaSignOutAlt, FaCreditCard } from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();
  
  // Check if the current path matches the link path
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.setItem('isAdmin', 'false');
  };

  return (
    <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-md border-r border-purple-100">
      <div className="p-6 border-b border-purple-100">
        <h2 className="text-xl font-bold text-purple-800">Admin Panel</h2>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          <li>
            <Link 
              to="/orderadmin-dashboard" 
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin') 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaHome className="mr-3 text-lg" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/order-admin" 
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/orders') 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaClipboardList className="mr-3 text-lg" />
              <span>Orders</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/payment-admin" 
              className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/admin/payments') 
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800' 
                  : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaCreditCard className="mr-3 text-lg" />
              <span>Payments</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/login" 
              onClick={handleLogout}
              className="flex items-center px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <FaSignOutAlt className="mr-3 text-lg" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
