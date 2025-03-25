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
import Hero2 from "../assets/Home/Car1.jpg";
import Hero3 from "../assets/Home/Hero3.jpg";
import About5 from "../assets/Home/About5.jpg";
import About7 from "../assets/Home/About7.jpg";

function Home() {
    return (
        <>
            {/* About Section */}
            <div className="h-screen w-full relative flex justify-center items-center bg-gray-100" id="AboutSection">
                <div className="h-[80vh] w-[91%] flex mb-[120px] shadow-2xl rounded-xl overflow-hidden">
                    {/* Left Section with Image */}
                    <div className="h-full w-1/2 flex justify-center items-center">
                        <div
                            style={{ backgroundImage: `url(${About6})` }}
                            className="bg-cover bg-center w-full h-full transform scale-105 transition-transform duration-700 hover:scale-110"
                        />
                    </div>

                    {/* Right Section with Text */}
                    <div className="h-full w-1/2 flex flex-col justify-center bg-white p-10">
                        <div className="ml-[10%]">
                            {/* Heading */}
                            <div className="w-[40%] text-2xl font-bold flex items-center text-gray-700 tracking-wider mb-3">
                                <GiAutoRepair className="text-[#eb3301] mx-2" />
                                <h1>ABOUT US</h1>
                                <GiAutoRepair className="text-[#eb3301] mx-2" />
                            </div>

                            {/* Title */}
                            <div className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
                                Dispelling Myths, Delivering Excellence.
                            </div>

                            {/* Meaningful Description */}
                            <div className="w-[85%] font-medium text-gray-600 leading-relaxed mb-6">
                                At our automobile service center, we understand how misconceptions about car repair can hold you back. Our mission is to debunk these myths by providing expert services that keep your vehicle in optimal condition. With a blend of innovation and expertise, we deliver repairs that are both reliable and hassle-free, ensuring your peace of mind.
                            </div>

                            {/* Feature List */}
                            <div className="grid grid-cols-2 gap-6 font-semibold text-gray-700">
                                {[
                                    "Exceptional Quality.",
                                    "Unmatched Expertise.",
                                    "Innovative Solutions.",
                                    "Customer-Centric Approach.",
                                    "Industry Leadership.",
                                    "Sourcing the Best.",
                                    "Immediate Quality.",
                                    "Transforming the Ordinary."
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center text-lg">
                                        <IoCheckmarkSharp className="text-[#006AFF] mr-3" />
                                        <div>{item}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistics Section */}
                <div className="h-[15vh] absolute bottom-0 right-0 left-0 w-full bg-[#111827] flex items-center justify-center gap-[5%] text-white py-4 shadow-inner">
                    {[
                        { end: 725, suffix: "+", label: "PIONEER THROUGHS" },
                        { end: 129, suffix: "+", label: "CLIENT EXPECTATIONS" },
                        { end: 66000, separator: ",", label: "DELIVERED PROMISES" },
                        { end: 63000, separator: ",", label: "COMPANY AWARDS" },
                    ].map((item, index) => (
                        <div key={index} className="w-[210px] text-center">
                            <div className="text-6xl font-extrabold text-[#54E2EB]">
                                <CountUp end={item.end} duration={2} separator={item.separator} suffix={item.suffix} />
                            </div>
                            <div className="text-lg font-semibold mt-2">{item.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative w-full h-full min-h-[75vh] overflow-hidden" id="HeroSection">
                <Carousel
                    showThumbs={false}
                    autoPlay
                    infiniteLoop
                    interval={5000}
                    showArrows={false}
                    showStatus={false}
                >
                    {[
                        {
                            title: "NON STOP CAR SERVICES CENTER",
                            subtitle: "Get Your Car Solution",
                            description: "Take Payments online with a scalable platform that grows your perfect business",
                            buttonText: "GET AN APPOINTMENT",
                            backgroundImage: Hero1,
                        },
                        {
                            title: "EXPERT CAR REPAIRS",
                            subtitle: "Quality Service You Can Trust",
                            description: "Our experienced technicians ensure your vehicle is in top condition.",
                            buttonText: "BOOK NOW",
                            backgroundImage: Hero3,
                        },
                    ].map((slide, index) => (
                        <div key={index}>
                            <div
                                className="relative w-full h-full"
                                style={{
                                    backgroundImage: `url(${slide.backgroundImage})`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "center",
                                    backgroundSize: "cover",
                                    minHeight: "76vh",
                                }}
                            >
                                <div className="absolute inset-0 bg-black opacity-50"></div>
                                <div className="relative z-10 max-w-[750px] text-white flex flex-col text-start p-8">
                                    <h4 className="mt-[15%] font-bold text-xl">{slide.title}</h4>
                                    <h1 className="text-6xl font-bold mt-4">
                                        {slide.subtitle}{" "}
                                        <span className="text-[#0BEEFD]">Amazing</span>
                                    </h1>
                                    <p className="mt-4 text-lg md:text-xl">{slide.description}</p>
                                    <Link to="/appointment-form">
                                        <button className="bg-transparent hover:bg-[#006AFF] px-4 py-3 text-xl text-[#006AFF] hover:text-white border-2 font-bold border-[#006AFF] rounded-md shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 ease-in-out mt-4 w-[30%]">
                                            {slide.buttonText}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </Carousel>
            </div>

            {/* Package Section */}
            <div className="w-full h-[100vh] p-5 bg-gray-100 flex flex-col" id="PackageSection">
                <div className="w-full md:w-[95%] mx-auto flex-1 flex flex-col md:flex-row justify-between">
                    {/* Service Cards */}
                    <div className="w-full md:w-[48%] mb-6 md:mb-0 rounded-lg overflow-hidden flex-grow">
                        <div className="grid h-full grid-cols-1 gap-4 p-4 md:grid-cols-2">
                            {[
                                {
                                    title: "Nano Treatments",
                                    description: "Nanotechnology enhances surface durability by filling microscopic holes with a repelling agent, creating a waterproof barrier that resists water, UV rays, and harmful chemicals.",
                                    features: ["RESISTANCE", "DURABILITY", "EFFECT"],
                                },
                                {
                                    title: "ENGINE TUNE-UPS",
                                    description: "Engine tune-ups improve efficiency, reduce emissions, and extend vehicle life by inspecting components like spark plugs, oil filters, and optimizing overall engine performance.",
                                    features: ["Intake Manifold De-carbonizing", "Spark Plug Check & inspection", "Ignition Coil Inspection"],
                                },
                                {
                                    title: "LUBE SERVICES",
                                    description: "Car lubrication services involve replacing oils, inspecting the lubrication system, and ensuring functionality to keep the engine healthy, efficient, and safe, including oil changes.",
                                    features: ["Inspections of the oil tank", "Fluid change", "New oil filter"],
                                },
                                {
                                    title: "Wheel Alignment",
                                    description: "Proper wheel alignment ensures even tyre wear and optimal performance. Modern four-wheel alignment is necessary for today's vehicles, including both front and rear-wheel drives.",
                                    features: ["Safe, predictable vehicle control", "Improved fuel efficiency", "Smooth and comfortable ride"],
                                },
                            ].map((service, index) => (
                                <div key={index} className="p-4 transition-transform duration-300 ease-in-out border rounded-lg shadow-lg bg-gradient-to-r from-[#fefbfb] via-[#f5f5f5] to-[#e1e1e1] hover:scale-95">
                                    <h1 className="text-xl md:text-2xl font-bold text-center text-[#006AFF]">{service.title}</h1>
                                    <div className="p-2">
                                        <div className="font-semibold text-gray-800">{service.description}</div>
                                        <ul className="mt-2 font-bold text-gray-800">
                                            {service.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-center text-gray-700 mt-2">
                                                    <AiTwotoneThunderbolt className="text-[#006AFF] mr-2" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;