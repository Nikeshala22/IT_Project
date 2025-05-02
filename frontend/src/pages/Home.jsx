import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { GiAutoRepair, GiCarWheel } from "react-icons/gi";
import { IoConstruct, IoMailOutline, IoCallOutline } from "react-icons/io5";
import { FaRegClock, FaMapMarkerAlt } from "react-icons/fa";
import CountUp from "react-countup";
import AboutImage from "../assets/Home/About6.jpg";
import Hero1 from "../assets/Home/Car2.jpg";
import Hero2 from "../assets/Home/Hero3.jpg";

const Home = () => {
  const scrollToSection = (sectionId) => {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section id="HeroSection" className="relative">
        <Carousel
          showThumbs={false}
          infiniteLoop
          autoPlay
          interval={5000}
          showStatus={false}
          showArrows={false}
          className="h-screen"
        >
          {[Hero1, Hero2].map((image, index) => (
            <div key={index} className="relative h-screen">
              <img
                src={image}
                alt={`Hero ${index + 1}`}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center">
                <div className="max-w-7xl mx-auto px-4 text-center text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6">
                    Premium Auto Care Services
                  </h1>
                  <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                    Professional vehicle maintenance and repair services you can trust
                  </p>
                  <button
                    onClick={() => scrollToSection("#ContactSection")}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Schedule Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Carousel>
      </section>

      {/* About Section */}
      <section id="AboutSection" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <img
                src={AboutImage}
                alt="About Us"
                className="rounded-xl shadow-xl w-full"
              />
            </div>
            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                About Our Auto Care Services
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                With over 15 years of experience in automotive care, we provide
                comprehensive services using cutting-edge technology and certified
                technicians. Our commitment to quality ensures your vehicle receives
                the best possible care.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <GiAutoRepair className="text-blue-600 text-3xl flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Expert Technicians</h3>
                    <p className="text-gray-600">ASE Certified professionals</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white rounded-lg shadow-sm">
                  <IoConstruct className="text-blue-600 text-3xl flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Modern Equipment</h3>
                    <p className="text-gray-600">State-of-the-art diagnostic tools</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="ServicesSection" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Engine Repair",
                icon: <GiAutoRepair className="text-4xl text-blue-600" />,
                description: "Complete engine diagnostics and repair services",
              },
              {
                title: "Brake Service",
                icon: <GiCarWheel className="text-4xl text-blue-600" />,
                description: "Brake inspection and replacement services",
              },
              {
                title: "Oil Change",
                icon: <IoConstruct className="text-4xl text-blue-600" />,
                description: "Premium synthetic oil change services",
              },
              {
                title: "Tire Service",
                icon: <GiCarWheel className="text-4xl text-blue-600" />,
                description: "Rotation, alignment, and replacement",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="text-center mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-center mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="StatisticsSection" className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 15000, label: "Happy Clients" },
              { value: 5000, label: "Repairs Completed" },
              { value: 15, label: "Years Experience" },
              { value: 50, label: "Certified Experts" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">
                  <CountUp end={stat.value} duration={3} />+
                </div>
                <div className="text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="ContactSection" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
              Contact Us
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <IoMailOutline className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <p className="text-gray-600">contact@autocare.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <IoCallOutline className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Phone</h3>
                    <p className="text-gray-600">+94 91 550 3671</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FaMapMarkerAlt className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Address</h3>
                    <p className="text-gray-600">123 Auto Care Street, Colombo</p>
                  </div>
                </div>
              </div>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <textarea
                    rows="4"
                    placeholder="Your Message"
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
                  ></textarea>
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;