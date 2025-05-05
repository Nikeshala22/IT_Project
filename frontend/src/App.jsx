import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Footer from './components/Footer';
import AppointmentForm from './pages/appointment/appointment';
import Login from '../login';
import { AppContent } from './context/inventryContext/AppContex';



// For Create React App: Use process.env.REACT_APP_BACKEND_URL
// For Vite: Use import.meta.env.VITE_BACKEND_URL and update .env variable to VITE_BACKEND_URL
const backendurl = (typeof process !== 'undefined' && process.env.REACT_APP_BACKEND_URL) || 'http://localhost:4000';

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
        </Routes>
        <Footer />
      </div>
    </AppContent.Provider>
  );
}

export default App;