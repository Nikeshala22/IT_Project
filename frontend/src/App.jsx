import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Footer from './components/Footer';
import AppointmentForm from './pages/appointment/appointment'; // Adjust path based on your structure // Adjust path based on your structure
import NavBar from './components/navbar';
import Login from '../login';
import Packages from './pages/servicePackage/Package';
import { AppContent } from './context/inventryContext/AppContex';







const backendurl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  return (
    <AppContent.Provider value={{ backendurl, isLoggedin, setIsLoggedin, userData, setUserData }}>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/appointment-form" element={<AppointmentForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/packages" element={<Packages />} />
        </Routes>
        <Footer />
      </div>
    </AppContent.Provider>
  );
}

export default App;