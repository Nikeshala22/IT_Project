import React from "react";
import { GiAutoRepair } from "react-icons/gi";
import { IoCheckmarkSharp } from "react-icons/io5";
import { AiTwotoneThunderbolt } from "react-icons/ai";
import { Link } from 'react-router-dom';
import CountUp from 'react-countup';
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import About6 from "../assets/Home/About6.jpg";
import Hero1 from "../assets/Home/Car2.jpg";
import Hero3 from "../assets/Home/Hero3.jpg";

function Home() {
    return (
        <>
            {/* Hero Section */}
            <div className="relative w-full h-screen overflow-hidden" id="HeroSection">
                <Carousel showThumbs={false} autoPlay infiniteLoop interval={5000} showArrows={false} showStatus={false}>
                    {[{
                        title: "NON STOP CAR SERVICES CENTER",
                        subtitle: "Get Your Car Solution",
                        description: "Take Payments online with a scalable platform that grows your business",
                        buttonText: "GET AN APPOINTMENT",
                        backgroundImage: Hero1,
                    }, {
                        title: "EXPERT CAR REPAIRS",
                        subtitle: "Quality Service You Can Trust",
                        description: "Our experienced technicians ensure your vehicle is in top condition.",
                        buttonText: "BOOK NOW",
                        backgroundImage: Hero3,
                    }].map((slide, index) => (
                        <div key={index} className="relative w-full h-screen bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${slide.backgroundImage})` }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
                            <div className="relative z-10 text-white text-center p-8">
                                <h4 className="text-xl font-bold uppercase text-yellow-400">{slide.title}</h4>
                                <h1 className="text-5xl font-bold mt-4 text-blue-300">{slide.subtitle} <span className="text-yellow-500">Amazing</span></h1>
                                <p className="mt-4 text-lg text-gray-200">{slide.description}</p>
                                <Link to="/appointment">
                                    <button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 px-6 py-3 text-lg font-bold text-white rounded-lg shadow-xl transition-all duration-300">
                                        {slide.buttonText}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>
 {/* About Section */}
 <div className="w-full bg-gradient-to-r from-red-500 to-yellow-500 py-16 text-white" id="AboutSection">
                <div className="container mx-auto flex flex-wrap lg:flex-nowrap items-center">
                    <div className="w-full lg:w-1/2 p-6">
                        <img src={About6} alt="About Us" className="rounded-lg shadow-lg" />
                    </div>
                    <div className="w-full lg:w-1/2 p-6">
                        <h2 className="text-4xl font-bold flex items-center">
                            <GiAutoRepair className="text-black mr-2" /> ABOUT US <GiAutoRepair className="text-black ml-2" />
                        </h2>
                        <p className="text-lg mt-4 leading-relaxed">We are a premier car service center dedicated to providing top-quality maintenance and repair services. With state-of-the-art equipment and a team of highly skilled technicians, we ensure your vehicle gets the best care possible.</p>
                        <p className="mt-4 text-lg">Our mission is to keep your vehicle running smoothly, safely, and efficiently. We offer a range of services from routine maintenance to advanced diagnostics and repairs.</p>
                        <p className="mt-4 text-lg">Customer satisfaction is our top priority. We value transparency, efficiency, and excellence in every service we provide.</p>
                        <div className="mt-6 flex gap-4">
                            
                            <Link to="/contact">
                                <button className="bg-green-500 hover:bg-green-700 px-6 py-3 text-lg font-bold rounded-lg shadow-lg transition-all">Read More..</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div className="w-full bg-gradient-to-r from-gray-100 to-gray-300 py-16" id="ServicesSection">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold text-gray-900">Our Services</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                        {[{
                            title: "Nano Treatments",
                            description: "Enhances surface durability with waterproof protection.",
                        }, {
                            title: "Engine Tune-Ups",
                            description: "Improves efficiency, reduces emissions, and extends vehicle life.",
                        }, {
                            title: "Lube Services",
                            description: "Ensures smooth engine performance with quality lubrication.",
                        }, {
                            title: "Wheel Alignment",
                            description: "Optimizes tyre wear and vehicle control.",
                        }].map((service, index) => (
                            <div key={index} className="p-6 bg-white border rounded-lg shadow-xl transform hover:scale-105 transition-all duration-300">
                                <h3 className="text-xl font-semibold text-blue-600">{service.title}</h3>
                                <p className="text-gray-600 mt-2">{service.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Static Statistics Section */}
            <div className="w-full bg-gradient-to-r from-purple-600 to-blue-500 py-16 text-white" id="StatisticsSection">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold">Our Achievements</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
                        {[{
                            title: "Happy Customers",
                            value: 12000,
                        }, {
                            title: "Cars Repaired",
                            value: 5000,
                        }, {
                            title: "Years of Experience",
                            value: 15,
                        }, {
                            title: "Expert Technicians",
                            value: 50,
                        }].map((stat, index) => (
                            <div key={index} className="p-6 bg-white bg-opacity-20 backdrop-blur-lg rounded-lg shadow-lg">
                                <h3 className="text-5xl font-bold text-yellow-300">
                                    <CountUp end={stat.value} duration={3} />+
                                </h3>
                                <p className="text-lg mt-2 text-red-900">{stat.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <div className="w-full bg-gray-900 text-white py-16" id="ContactSection">
                <div className="container mx-auto text-center">
                    <h2 className="text-4xl font-bold">Get In Touch</h2>
                    <p className="text-gray-400 mt-4">We're here to help. Contact us today for any inquiries.</p>
                    <div className="mt-8">
                        <Link to="/contact">
                            <button className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all">Contact Us</button>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;