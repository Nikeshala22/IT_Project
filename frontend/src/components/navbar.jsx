import React, { useContext } from 'react';
import { IoIosMail } from 'react-icons/io';
import { IoCallSharp } from 'react-icons/io5';
import { FaRegClock } from 'react-icons/fa';
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaGoogle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import logo from '../assets/Home/Logo3.webp';
import { AppContent } from '../context/inventryContext/AppContex';



function NavBar() {
  const { isLoggedin, setIsLoggedin, setUserData, backendurl } = useContext(AppContent);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${backendurl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success('Logged out successfully');
        navigate('/');
      } else {
        toast.error(response.data.message || 'Logout failed');
      }
    } catch (error) {
      toast.error('Error during logout');
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-fit mb-14 scroll-smooth">
      <div className="z-40 absolute w-[250px] h-[100px] bg-[#006AFF] angled-rectangle1">
        <img src={logo} alt="Logo" className="w-[250px] h-[130px] bg-cover bg-center" />
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
            <IoIosMail size={40} />
            <div>
              <h5>Make An Email</h5>
              <h5 className="font-bold">WashAndGo5Help@gmail.com</h5>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-10 mt-4">
            <IoCallSharp size={40} />
            <div>
              <h5>Call Us 24/7</h5>
              <h5 className="font-bold">+94 91 550 3671</h5>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-10 mt-4">
            <FaRegClock size={40} />
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
            <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">HOME</li>
          </Link>
          <Link to="#AboutSection">
            <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">ABOUT US</li>
          </Link>
          <Link to="#PackageSection">
            <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">SERVICE PACKAGES</li>
          </Link>
          <Link to="#Offer">
            <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">OFFER</li>
          </Link>
          <Link to="/RecoveryHome">
            <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">RECOVERY</li>
          </Link>
          <Link to="/spare">
            <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">STORE</li>
          </Link>
          <Link to="/HomeContactUs">
            <li className="hover:text-[#006AFF] transition duration-200 cursor-pointer">CONTACT US</li>
          </Link>

          <li className="flex items-center gap-2">
            {isLoggedin ? (
              <button
                onClick={handleLogout}
                className="bg-transparent border border-[#006AFF] text-[#006AFF] w-[100px] px-4 py-2 shadow-md hover:bg-[#006AFF] hover:text-white transition duration-200"
              >
                Log Out
              </button>
            ) : (
              <Link to="/login">
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