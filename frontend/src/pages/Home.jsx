import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import CountUp from 'react-countup';
import { GiAutoRepair, GiCarWheel } from 'react-icons/gi';
import { IoConstruct, IoMailOutline, IoCallOutline } from 'react-icons/io5';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { AiTwotoneThunderbolt } from 'react-icons/ai';
import AboutImage from '../assets/Home/About6.jpg';
import Hero1 from '../assets/Home/Car2.jpg';
import Hero2 from '../assets/Home/Hero3.jpg';

const Home = () => {
  const scrollToSection = id => {
    const el = document.querySelector(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION */}
      <section id="HeroSection" className="relative h-screen">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          showStatus={false}
          showArrows={false}
          className="h-full"
        >
          {[Hero1, Hero2].map((img, idx) => (
            <div key={idx} className="relative h-full">
              <img src={img} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 flex items-center px-4">
                <div className="max-w-3xl text-white space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold">
                    {idx === 0 ? 'NON STOP CAR SERVICES CENTER' : 'EXPERT CAR REPAIRS'}
                  </h1>
                  <p className="text-lg md:text-xl">
                    {idx === 0
                      ? 'Get Your Car Solution'
                      : 'Quality Service You Can Trust'}
                  </p>
                  <div className="flex space-x-4 mt-6">
                    <button
                      onClick={() => scrollToSection('#ContactSection')}
                      className="bg-blue-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Schedule Service
                    </button>
                    <Link to="/appointment-form">
                      <button
                        className="px-6 py-3 border-2 font-bold rounded-lg shadow-md transition ease-in-out duration-300 text-[#006AFF] border-[#006AFF] hover:bg-[#006AFF] hover:text-white"
                      >
                        {idx === 0 ? 'BOOK NOW' : 'GET AN APPOINTMENT'}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* ABOUT SECTION */}
      <section id="AboutSection" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2 mb-8 lg:mb-0">
            <img src={AboutImage} alt="About Us" className="rounded-xl shadow-xl w-full" />
          </div>
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              About Our Auto Care Services
            </h2>
            <p className="text-gray-600 mb-6 text-lg leading-relaxed">
              With over 15 years of experience in automotive care, we provide comprehensive services using cutting-edge technology and certified technicians.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <GiAutoRepair className="text-blue-600 text-3xl" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Expert Technicians</h3>
                  <p className="text-gray-600">ASE Certified professionals</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                <IoConstruct className="text-blue-600 text-3xl" />
                <div>
                  <h3 className="text-xl font-semibold mb-1">Modern Equipment</h3>
                  <p className="text-gray-600">State-of-the-art diagnostic tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section id="ServicesSection" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Engine Repair', icon: <GiAutoRepair className="text-4xl text-blue-600" />, description: 'Complete engine diagnostics and repair services' },
              { title: 'Brake Service', icon: <GiCarWheel className="text-4xl text-blue-600" />, description: 'Brake inspection and replacement services' },
              { title: 'Oil Change', icon: <IoConstruct className="text-4xl text-blue-600" />, description: 'Premium synthetic oil change services' },
              { title: 'Tire Service', icon: <GiCarWheel className="text-4xl text-blue-600" />, description: 'Rotation, alignment, and replacement' }
            ].map((svc, i) => (
              <div key={i} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="text-center mb-4">{svc.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-2">{svc.title}</h3>
                <p className="text-gray-600 text-center">{svc.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATISTICS SECTION */}
      <section id="StatisticsSection" className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 15000, label: 'Happy Clients' },
              { value: 5000, label: 'Repairs Completed' },
              { value: 15, label: 'Years Experience' },
              { value: 50, label: 'Certified Experts' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <CountUp end={stat.value} duration={3} />+
                </div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGE SECTION */}
      <section id="PackageSection" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Nano Treatments', description: 'Nanotechnology enhances surface durability...', features: ['RESISTANCE', 'DURABILITY', 'EFFECT'] },
              { title: 'ENGINE TUNE-UPS', description: 'Engine tune-ups improve efficiency...', features: ['Intake Manifold', 'Spark Plug Check', 'Ignition Coil Inspection'] },
              { title: 'LUBE SERVICES', description: 'Car lubrication services involve...', features: ['Oil Inspection', 'Fluid change', 'New oil filter'] },
              { title: 'Wheel Alignment', description: 'Proper wheel alignment ensures...', features: ['Predictable control', 'Fuel efficiency', 'Comfortable ride'] }
            ].map((pkg, i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow-lg hover:scale-95 transition">
                <h3 className="text-2xl font-bold text-blue-600 mb-4">{pkg.title}</h3>
                <p className="text-gray-700 mb-4">{pkg.description}</p>
                <ul className="space-y-2">
                  {pkg.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center">
                      <AiTwotoneThunderbolt className="text-blue-600 mr-2" />{feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="ContactSection" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">                  
                <div className="bg-blue-100 p-3 rounded-full">
                  <IoMailOutline className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Email</h3>
                  <p className="text-gray-600">contact@autocare.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <IoCallOutline className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Phone</h3>
                  <p className="text-gray-600">+94 91 550 3671</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1">Address</h3>
                  <p className="text-gray-600">123 Auto Care Street, Colombo</p>
                </div>
              </div>
            </div>
            <form className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <input type="email" placeholder="Your Email" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600" />
              <textarea rows="4" placeholder="Your Message" className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"></textarea>
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
