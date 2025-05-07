import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContent } from '../../context/AppContex';

const Packages = () => {
  const navigate = useNavigate();
  const context = useContext(AppContent);
  const [packages] = useState([
    {
      _id: '1',
      name: 'Essential Care',
      description: 'Fundamental maintenance to keep your vehicle running smoothly.',
      price: 5990.00,
      services: ['Wash and Grooming', 'Lube Services', 'Battery Services'],
    },
    {
      _id: '2',
      name: 'Complete Detailing',
      description: 'Comprehensive detailing for a pristine vehicle inside and out.',
      price: 12990.00,
      services: [
        'Exterior & Interior Detailing',
        'Windscreen Treatments',
        'Inspection Reports',
      ],
      isPopular: true,
    },
    {
      _id: '3',
      name: 'Premium Overhaul',
      description: 'Advanced care for specialized maintenance needs.',
      price: 12500.00,
      services: ['Under carriage Degreasing', 'Body Shop', 'Wheel Alignment'],
    },
  ]);

  if (!context) {
    throw new Error('Packages must be used within an AppContextProvider');
  }

  const { userData } = context;

  const handleBookService = () => {
    if (!userData) {
      toast.error('Please login to book a package');
      navigate('/login');
    } else {
      navigate('/appointment-form');
    }
  };

  return (
    <div className="flex-grow pt-16 bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[70vh] flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(/assets/car-service-hero.jpg)` }} // Replace with your asset
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight mb-6 animate-fade-in-up">
            Discover Our Service Packages
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 animate-fade-in-up delay-100">
            Tailored vehicle care for every need.
          </p>
          <button
            onClick={handleBookService}
            className="bg-[#03326F] text-white font-semibold text-lg uppercase py-3 px-10 rounded-lg hover:bg-[#0052CC] transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 animate-fade-in-up delay-200"
          >
            Book a Service
          </button>
        </div>
      </div>

      {/* Packages Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12 animate-fade-in">
          Our Service Packages
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="relative bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl hover:scale-105"
            >
              {pkg.isPopular && (
                <span className="absolute top-4 right-4 bg-[#006AFF] text-white text-xs font-bold uppercase px-3 py-1 rounded-full z-10">
                  Most Popular
                </span>
              )}
              <div className="p-8 relative z-10">
                <h3 className="text-2xl font-bold text-gray-900 uppercase mb-3">{pkg.name}</h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-[#006AFF]">LKR {pkg.price.toFixed(2)}</span>
                  <span className="text-gray-500 text-sm ml-2">/ package</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {pkg.services.map((service, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-700 animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-[#006AFF] mr-3">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      {service}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Animations */}
      <style>
        {`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
          .delay-100 {
            animation-delay: 100ms;
          }
          .delay-200 {
            animation-delay: 200ms;
          }
        `}
      </style>
    </div>
  );
};

export default Packages;