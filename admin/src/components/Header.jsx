import React, { useState, useEffect } from "react";
import profile from '../../assets/Dashboard/Profile.png';
import { FaBell } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNavLinks from "./SideNavLinks";
import logoname from '../../assets/LogoName.png';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [sessionData, setSessionData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchSessionData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Session', {
        withCredentials: true // include this if you are using cookies for session management
      });
      setSessionData(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError(err.response?.data.message || 'Failed to retrieve session data');
      console.error('Error fetching session data:', err);
    }
  };

  useEffect(() => {
    fetchSessionData();
  }, []); // Fetch session data on component mount

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, {
        withCredentials: true // include this if you are using cookies for session management
      });
      // Navigate to the login page after successful logout
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.response?.data.message || err.message);
      // Optionally, handle error state
    }
  };

  return (
    <header className="bg-white shadow px-4 py-3 flex items-center justify-end">

      {/* <input
        type="text"
        placeholder="Search..."
        className="w-full max-w-sm bg-gray-200 rounded-lg p-2" /> */}

      <div className="flex items-center space-x-4 h-full bg-white relative z-10">
        <span className="h-10 w-10 rounded-full hover:shadow-md hover:shadow-black hover:duration-500">
          <FaBell className="ms-2.5 mt-2.5 h-5 w-5" />
        </span>
        <span className="h-10 w-10 rounded-full hover:shadow-md hover:shadow-black hover:duration-500">
          <IoMdMail className="ms-2 mt-2 h-6 w-6" />
        </span>
        <img
          src={profile}
          alt="Profile"
          onClick={() => setToggle(!toggle)}
          className="h-10 w-10 rounded-full hover:shadow-md hover:shadow-black hover:duration-500"
        />
        <span className="text-gray-700 font-bold ">{sessionData?.Name}</span>
      </div>
      {toggle && (
        <div className="fixed right-[9%] bg-black hover:shadow-sm hover:shadow-black text-white duration-300 mt-24 z-10">
          <button onClick={handleLogout} className="border py-1 px-3 font-bold hover:bg-red-600 duration-200">
            Log Out
          </button>
        </div>
      )}
    </header>
  );
}