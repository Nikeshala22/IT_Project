import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from '../context/authContext/authContext';
import logo from '../assets/Home/Logo3.webp';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "#HeroSection", text: "HOME" },
    { path: "#AboutSection", text: "ABOUT" },
    { path: "#ServicesSection", text: "SERVICES" },
    { path: "#StatisticsSection", text: "STATS" },
    { path: "#ContactSection", text: "CONTACT" },
    { path: "/spareparts", text: "STORE" },
  ];

  const handleScroll = (hash) => {
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logo} 
              alt="Company Logo" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.path.startsWith('#') ? (
                <button
                  key={item.path}
                  onClick={() => handleScroll(item.path)}
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition-colors"
                >
                  {item.text}
                </button>
              ) : (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `px-3 py-2 font-medium transition-colors ${
                      isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                    }`
                  }
                >
                  {item.text}
                </NavLink>
              )
            ))}

            {/* Profile Dropdown */}
            {currentUser ? (
              <Menu as="div" className="relative ml-4">
                <Menu.Button className="flex items-center space-x-1 focus:outline-none">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white font-medium">
                    {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </Menu.Button>

                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link
                            to="/my-profile"
                            className={`block px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            }`}
                          >
                            My Profile
                          </Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`w-full text-left px-4 py-2 text-sm ${
                              active ? 'bg-gray-100 text-red-600' : 'text-red-500'
                            }`}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <NavLink
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-lg hover:from-purple-700 hover:to-pink-600 transition-colors font-medium"
              >
                Login
              </NavLink>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            {currentUser && (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center text-white mr-4">
                {currentUser.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                item.path.startsWith('#') ? (
                  <button
                    key={item.path}
                    onClick={() => handleScroll(item.path)}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 w-full text-left"
                  >
                    {item.text}
                  </button>
                ) : (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.text}
                  </NavLink>
                )
              ))}

              {/* Mobile Profile Links */}
              <div className="border-t pt-2">
                {currentUser ? (
                  <>
                    <Link
                      to="/order-data"
                      className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;