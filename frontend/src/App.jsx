import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/navbar'; // Import NavBar
import Home from './pages/Home'; // Path to your Home component
import Footer from './components/Footer'; // Import Footer
import AppointmentForm from './pages/appointment/appointment'; // Import AppointmentForm

function App() {
  return ( 
    <div>
      <NavBar /> {/* Add NavBar here */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home route */}
        <Route path="/appointment-form" element={<AppointmentForm />} /> {/* Appointment Form route */}
      </Routes>
      <Footer /> {/* Add Footer here */}
    </div>
  );
}

export default App;