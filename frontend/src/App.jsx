import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar'; // Import NavBar
import Home from './pages/Home'; // Path to your Home component
import Footer from './components/Footer'; // Import Footer
import SpareParts from './pages/spareParts/SpareParts';
import AppointmentForm from './pages/appointment/appointment';
import Packages from './pages/servicePackage/Package';


function App() {
  return (
      <div>
        <NavBar /> {/* Add NavBar here */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home route */}
          <Route path="/spareparts" element={<SpareParts />} />
          <Route path="/appointment-form" element={<AppointmentForm />} />
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/packages" element={<Packages />} />
        </Routes>
        <Footer /> {/* Add Footer here */}
      </div>
  );
}

export default App;
