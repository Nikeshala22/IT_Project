import React, { useState, useEffect } from "react";
import { IoIosMail } from "react-icons/io";
import { IoCallSharp } from "react-icons/io5";
import { FaRegClock } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from 'axios';
import logo from '../assets/Home/Logo3.webp'; // Import logo from src/assets

function NavBar() {
    const [userData, setUserData] = useState(null);
    const [image, setImage] = useState(null);

    // Fetch user session data (login status)
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/Session');
                setUserData(response.data);
                console.log('User data fetched:', response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    // Fetch user profile image (if any)
    useEffect(() => {
        const fetchImages = async () => {
            if (userData) {
                const imageUrl = `http://localhost:5000/ImageUploads?customerId=${userData.userId}`;
                try {
                    const response = await axios.get(imageUrl);
                    if (response.data.images && response.data.images.length > 0) {
                        setImage(response.data.images[0].imageUrl);
                        console.log('Image URL:', response.data.images[0].imageUrl);
                    }
                } catch (error) {
                    console.error('Error fetching images:', error);
                }
            }
        };

        fetchImages();
    }, [userData]);

    return (
        <div className="h-fit mb-14 scroll-smooth">
            {/* Header Section */}
            <div className="z-40 absolute w-[250px] h-[100px] bg-[#006AFF] angled-rectangle1">
                <img src={logo} alt="Logo" className=" w-[250px]  h-[130px] bg-cover bg-center" /> {/* Using the imported logo */}
            </div>

            <div className="absolute w-[330px] h-[132px] bg-[#111827] angled-rectangle2 z-20"></div>

            <div className="absolute left-[280px] h-[55px] bg-white angled-rectangle3 right-0 flex justify-between items-center">
                <div className="font-bold text-xl ml-5">
                    Welcome to Wash & Go Automobile Service Company
                </div>

                <div className="flex items-center gap-3 mr-5">
                    <h1 className="w-[85px] font-bold">Follow Us :</h1>
                    <FaFacebookF className="cursor-pointer hover:text-[#006AFF] transition duration-300" />
                    <FaTwitter className="cursor-pointer hover:text-[#006AFF] transition duration-300" />
                    <FaLinkedinIn className="cursor-pointer hover:text-[#006AFF] transition duration-300" />
                    <FaGoogle className="cursor-pointer hover:text-[#006AFF] transition duration-300" />
                </div>
            </div>

            <div className="text-white z-30 relative top-[55px] h-[77px] bg-[#161920] angled-rectangle4">
                <div className="flex gap-16 ml-[250px]">
                    <div className="flex items-center gap-2 ml-10 mt-4">
                        <div>
                            <IoIosMail size={40} />
                        </div>
                        <div>
                            <h5>Make An Email</h5>
                            <h5 className="font-bold">WashAndGo5Help@gmail.com</h5>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-10 mt-4">
                        <div>
                            <IoCallSharp size={40} />
                        </div>
                        <div>
                            <h5>Call Us 24/7</h5>
                            <h5 className="font-bold">+94 91 550 3671</h5>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 ml-10 mt-4">
                        <div>
                            <FaRegClock size={40} />
                        </div>
                        <div>
                            <h5>Office Hours</h5>
                            <h5 className="font-bold">Mon-Sat 8am-6pm</h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#111827] h-[55px] relative top-[55px] right-0 left-0 flex items-center border-b-white border-t-2">
                <ul className="text-white font-semibold gap-14 relative left-[110px] flex items-center">
                    <Link to="/">
                        <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">
                            HOME
                        </li>
                    </Link>
                    <Link to="#AboutSection">
                        <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">
                            ABOUT US
                        </li>
                    </Link>
                    <Link to="#PackageSection">
                        <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">
                            SERVICE PACKAGES
                        </li>
                    </Link>
                    <Link to="#Offer">
                        <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">
                            OFFER
                        </li>
                    </Link>
                    <Link to="/RecoveryHome">
                        <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">
                            RECOVERY
                        </li>
                    </Link>
                    <Link to="/spare">
                        <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">
                            STORE
                        </li>
                    </Link>
                    <Link to="/HomeContactUs">
                        <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">
                            CONTACT US
                        </li>
                    </Link>

                    {/* Buttons with conditional rendering */}
                    <li className="flex items-center gap-2">
                        {userData ? (
                            <Link to="/Profile">
                                <img
                                    src={image ? `http://localhost:5000/${image}` : "https://www.skanlibrary.org/app/uploads/2018/12/mystery-person-300x300.png"}
                                    alt="Profile"
                                    className="rounded-full w-[45px] h-[45px] object-cover border-[2.4px] border-green-400 transition duration-300"
                                />
                            </Link>
                        ) : (
                            <Link to="/Login">
                                <button className="bg-transparent border border-[#006AFF] text-[#006AFF] w-[100px] px-4 py-2 shadow-md hover:bg-[#006AFF] hover:text-white transition duration-200">
                                    Sign In
                                </button>
                            </Link>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;