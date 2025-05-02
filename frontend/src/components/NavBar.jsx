import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from '../assets/Home/Logo3.webp';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  return (
    <nav className="bg-white shadow-lg w-full">
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
          <div className="hidden md:flex space-x-8">
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
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium transition-colors"
                >
                  {item.text}
                </NavLink>
              )
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;